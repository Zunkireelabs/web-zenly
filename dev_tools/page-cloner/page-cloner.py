"""
Crawl4AI-based Page Cloner with Organized Folder Structure
Uses Crawl4AI for JavaScript rendering, but saves assets in organized folders like the original
"""

import asyncio
import os
import re
import aiohttp
import aiofiles
from pathlib import Path
from datetime import datetime
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from crawl4ai import ProxyConfig, RoundRobinProxyStrategy
from typing import Set, Dict


class Crawl4AIFolderCloner:
    def __init__(self, proxy_file: str = None):
        """
        Initialize the folder-based cloner using Crawl4AI

        Args:
            proxy_file: Path to proxy file (format: ip:port:username:password per line)
        """
        self.proxy_file = proxy_file
        self.proxies = []
        self.proxy_strategy = None

        # Track downloaded assets
        self.downloaded_assets: Dict[str, str] = {}
        self.failed_downloads: Set[str] = set()

        # Statistics
        self.stats = {
            "html_files": 0,
            "css_files": 0,
            "js_files": 0,
            "images": 0,
            "fonts": 0,
            "other": 0,
            "failed": 0,
        }

        # Load proxies if file exists
        if proxy_file and os.path.exists(proxy_file):
            self.proxies = self._load_proxies(proxy_file)
            if self.proxies:
                self.proxy_strategy = RoundRobinProxyStrategy(self.proxies)
                print(f"✓ Loaded {len(self.proxies)} proxies from {proxy_file}")
        else:
            print("ℹ No proxy file provided or file not found")

    def _load_proxies(self, proxy_file: str) -> list:
        """Load proxies from file"""
        proxies = []
        try:
            with open(proxy_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        try:
                            proxy = ProxyConfig.from_string(line)
                            proxies.append(proxy)
                        except Exception as e:
                            print(f"⚠ Skipping invalid proxy line: {line[:30]}... ({e})")
        except Exception as e:
            print(f"❌ Error loading proxies: {e}")
        return proxies

    def generate_output_folder(self, url: str, base_folder: Path = None) -> Path:
        """Generate output folder for cloned page"""
        if base_folder is None:
            base_folder = Path.cwd()

        # Create readable timestamped folder name
        # Format: cloned_life-pro_co_uk_12-10-2025_15-38
        timestamp = datetime.now().strftime("%d-%m-%Y_%H-%M")
        domain = urlparse(url).netloc.replace(':', '_').replace('.', '_')
        folder_name = f"cloned_{domain}_{timestamp}"

        return base_folder / folder_name

    def create_directories(self, output_dir: Path):
        """Create directory structure for assets"""
        output_dir.mkdir(exist_ok=True)
        (output_dir / "assets").mkdir(exist_ok=True)
        (output_dir / "assets" / "css").mkdir(exist_ok=True)
        (output_dir / "assets" / "js").mkdir(exist_ok=True)
        (output_dir / "assets" / "images").mkdir(exist_ok=True)
        (output_dir / "assets" / "fonts").mkdir(exist_ok=True)
        (output_dir / "assets" / "other").mkdir(exist_ok=True)

    def get_asset_type(self, url: str) -> str:
        """Determine asset type from URL"""
        url_lower = url.lower()

        if any(ext in url_lower for ext in ['.css']):
            return 'css'
        elif any(ext in url_lower for ext in ['.js', '.jsx', '.ts', '.tsx']):
            return 'js'
        elif any(ext in url_lower for ext in ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp', '.avif']):
            return 'images'
        elif any(ext in url_lower for ext in ['.woff', '.woff2', '.ttf', '.otf', '.eot']):
            return 'fonts'
        else:
            return 'other'

    def sanitize_filename(self, url: str) -> str:
        """Create a safe filename from URL"""
        parsed = urlparse(url)
        path = parsed.path.lstrip('/')

        if not path or path == '/':
            return 'index.html'

        # Replace problematic characters
        safe_name = re.sub(r'[<>:"|?*]', '_', path)
        safe_name = safe_name.replace('/', '_')

        # Limit length
        if len(safe_name) > 200:
            ext = Path(safe_name).suffix
            safe_name = safe_name[:200-len(ext)] + ext

        return safe_name

    async def download_asset(self, session: aiohttp.ClientSession, url: str,
                            base_url: str, output_dir: Path) -> str:
        """
        Download an asset and save it locally

        Returns:
            Relative path to the downloaded asset
        """
        # Skip if already downloaded
        if url in self.downloaded_assets:
            return self.downloaded_assets[url]

        # Skip if previously failed
        if url in self.failed_downloads:
            return url

        # Make absolute URL
        absolute_url = urljoin(base_url, url)

        # Determine asset type
        asset_type = self.get_asset_type(absolute_url)

        # Generate local filename
        filename = self.sanitize_filename(absolute_url)
        local_path = output_dir / "assets" / asset_type / filename
        relative_path = f"assets/{asset_type}/{filename}"

        try:
            async with session.get(absolute_url, timeout=aiohttp.ClientTimeout(total=30)) as response:
                if response.status == 200:
                    content = await response.read()

                    # Save to file
                    async with aiofiles.open(local_path, 'wb') as f:
                        await f.write(content)

                    # Store relative path
                    self.downloaded_assets[url] = relative_path
                    self.downloaded_assets[absolute_url] = relative_path

                    # Update statistics
                    self.stats[asset_type] += 1

                    print(f"  ✓ Downloaded {asset_type}: {filename[:50]}")
                    return relative_path
                else:
                    print(f"  ✗ Failed (status {response.status}): {absolute_url[:60]}")
                    self.failed_downloads.add(url)
                    self.stats['failed'] += 1
                    return url

        except Exception as e:
            print(f"  ✗ Error downloading {url[:60]}: {str(e)[:50]}")
            self.failed_downloads.add(url)
            self.stats['failed'] += 1
            return url

    async def process_css(self, session: aiohttp.ClientSession, css_url: str,
                         css_content: str, output_dir: Path, base_url: str) -> str:
        """Process CSS content to download referenced assets and rewrite URLs"""
        # Find all URLs in CSS (url(...))
        url_pattern = r'url\(["\']?([^"\')]+)["\']?\)'
        urls = re.findall(url_pattern, css_content)

        for old_url in urls:
            # Skip data URLs
            if old_url.startswith('data:'):
                continue

            # Make absolute URL (relative to the CSS file)
            absolute_url = urljoin(css_url, old_url)

            # Download the asset
            local_path = await self.download_asset(session, absolute_url, base_url, output_dir)

            # Rewrite URL in CSS (relative from CSS location)
            if local_path != absolute_url:
                new_url = f"../{local_path.replace('assets/', '')}"
                css_content = css_content.replace(f'url({old_url})', f'url({new_url})')
                css_content = css_content.replace(f'url("{old_url}")', f'url("{new_url}")')
                css_content = css_content.replace(f"url('{old_url}')", f"url('{new_url}')")

        return css_content

    def _detect_error_type(self, error_message: str) -> tuple[str, int]:
        """Detect error type from error message"""
        error_lower = error_message.lower()

        if '402' in error_message:
            return ('payment_required', 1)
        elif '403' in error_message or 'forbidden' in error_lower:
            return ('forbidden', 5)
        elif '429' in error_message or 'rate limit' in error_lower:
            return ('rate_limit', 3)
        elif 'tunnel_connection_failed' in error_lower:
            return ('connection_failed', 2)
        elif 'timeout' in error_lower:
            return ('timeout', 2)
        else:
            return ('unknown', 2)

    async def clone_page(self, url: str, output_dir: Path = None, retry_without_proxy: bool = True) -> bool:
        """
        Clone a web page to organized folder structure using Crawl4AI

        Args:
            url: URL to clone
            output_dir: Where to save the cloned page (auto-generated if None)
            retry_without_proxy: If True, retry without proxy on failure

        Returns:
            True if successful, False otherwise
        """
        print(f"\n🔄 Cloning: {url}")

        # Generate output directory if not provided
        if output_dir is None:
            output_dir = self.generate_output_folder(url)

        # Create directory structure
        self.create_directories(output_dir)

        print(f"📁 Output directory: {output_dir}")

        # Step 1: Use Crawl4AI to render the page (with JavaScript)
        print(f"\n📄 Rendering page with Crawl4AI (JavaScript execution)...")

        # Try with proxy first (if available)
        if self.proxy_strategy:
            print(f"🔐 Attempting with proxy ({len(self.proxies)} available)...")
            html_content, success = await self._fetch_with_crawl4ai(url, use_proxy=True)

            if not success and retry_without_proxy:
                error_type, max_retries = self._detect_error_type(html_content or "")
                print(f"\n⚠️ Proxy attempt failed: {error_type.replace('_', ' ').title()}")

                # Retry logic
                for attempt in range(1, max_retries + 1):
                    print(f"\n🔄 Proxy retry {attempt}/{max_retries}...")
                    if error_type == 'rate_limit':
                        await asyncio.sleep(2 * attempt)

                    html_content, success = await self._fetch_with_crawl4ai(url, use_proxy=True)
                    if success:
                        break

                # Fall back to direct connection
                if not success:
                    print(f"\n🔄 Falling back to direct connection...")
                    html_content, success = await self._fetch_with_crawl4ai(url, use_proxy=False)
        else:
            html_content, success = await self._fetch_with_crawl4ai(url, use_proxy=False)

        if not success or not html_content:
            print(f"❌ Failed to fetch page content")
            return False

        self.stats['html_files'] += 1
        print(f"✅ Page rendered successfully!")

        # Step 2: Parse HTML and download assets
        print(f"\n🔍 Parsing HTML and downloading assets...")
        soup = BeautifulSoup(html_content, 'html.parser')
        base_url = url

        async with aiohttp.ClientSession() as session:
            # Download CSS files
            print(f"\n📦 Downloading CSS files...")
            for link in soup.find_all('link', rel='stylesheet'):
                if link.get('href'):
                    await self.download_and_process_css(session, link, base_url, output_dir)

            # Download JavaScript files
            print(f"\n📦 Downloading JavaScript files...")
            for script in soup.find_all('script', src=True):
                if script.get('src'):
                    await self.download_and_rewrite_tag(session, script, 'src', base_url, output_dir)

            # Download images
            print(f"\n🖼️  Downloading images...")
            for img in soup.find_all('img'):
                if img.get('src'):
                    await self.download_and_rewrite_tag(session, img, 'src', base_url, output_dir)
                if img.get('srcset'):
                    await self.process_srcset(session, img, base_url, output_dir)

        # Step 3: Save HTML file
        print(f"\n💾 Saving HTML file...")
        html_output = output_dir / "index.html"
        async with aiofiles.open(html_output, 'w', encoding='utf-8') as f:
            await f.write(str(soup))

        # Print summary
        self.print_summary(output_dir)

        print(f"\n✅ Page successfully cloned!")
        print(f"📁 Location: {output_dir}")
        print(f"🌐 Open {html_output} in your browser to view")

        return True

    async def _fetch_with_crawl4ai(self, url: str, use_proxy: bool = False) -> tuple[str, bool]:
        """Fetch page content using Crawl4AI"""
        try:
            browser_config = BrowserConfig(headless=True, verbose=False)
            crawler_config = CrawlerRunConfig(
                cache_mode=CacheMode.BYPASS,
                wait_for_images=True,
            )

            if use_proxy and self.proxy_strategy:
                crawler_config.proxy_rotation_strategy = self.proxy_strategy

            async with AsyncWebCrawler(config=browser_config) as crawler:
                result = await crawler.arun(url, config=crawler_config)

                if result.success and result.html:
                    return (result.html, True)
                else:
                    error_msg = result.error_message if hasattr(result, 'error_message') else 'Unknown error'
                    return (error_msg, False)

        except Exception as e:
            return (str(e), False)

    async def download_and_process_css(self, session: aiohttp.ClientSession,
                                      link_tag, base_url: str, output_dir: Path):
        """Download CSS file and process it for embedded assets"""
        css_url = link_tag.get('href')
        if not css_url:
            return

        absolute_url = urljoin(base_url, css_url)
        filename = self.sanitize_filename(absolute_url)
        local_path = output_dir / "assets" / "css" / filename

        try:
            async with session.get(absolute_url, timeout=aiohttp.ClientTimeout(total=30)) as response:
                if response.status == 200:
                    css_content = await response.text()

                    # Process CSS to download embedded assets
                    processed_css = await self.process_css(session, absolute_url, css_content, output_dir, base_url)

                    # Save CSS file
                    async with aiofiles.open(local_path, 'w', encoding='utf-8') as f:
                        await f.write(processed_css)

                    # Update link tag
                    relative_path = f"assets/css/{filename}"
                    link_tag['href'] = relative_path
                    self.downloaded_assets[css_url] = relative_path
                    self.stats['css_files'] += 1

                    print(f"  ✓ Downloaded and processed CSS: {filename[:50]}")
                else:
                    print(f"  ✗ Failed to download CSS (status {response.status}): {absolute_url[:60]}")
                    self.stats['failed'] += 1

        except Exception as e:
            print(f"  ✗ Error downloading CSS {css_url[:60]}: {str(e)[:50]}")
            self.stats['failed'] += 1

    async def download_and_rewrite_tag(self, session: aiohttp.ClientSession,
                                      tag, attr: str, base_url: str, output_dir: Path):
        """Download asset and rewrite the tag attribute"""
        url = tag.get(attr)
        if not url or url.startswith('data:'):
            return

        local_path = await self.download_asset(session, url, base_url, output_dir)

        # Update tag
        if local_path != url:
            tag[attr] = local_path

    async def process_srcset(self, session: aiohttp.ClientSession, tag,
                            base_url: str, output_dir: Path):
        """Process srcset attribute (multiple URLs)"""
        srcset = tag.get('srcset', '')
        if not srcset:
            return

        entries = [entry.strip() for entry in srcset.split(',')]
        new_entries = []

        for entry in entries:
            parts = entry.split()
            if len(parts) >= 1:
                url = parts[0]
                descriptor = ' '.join(parts[1:]) if len(parts) > 1 else ''

                if not url.startswith('data:'):
                    local_path = await self.download_asset(session, url, base_url, output_dir)
                    new_url = local_path if local_path != url else url
                    new_entries.append(f"{new_url} {descriptor}".strip())
                else:
                    new_entries.append(entry)

        tag['srcset'] = ', '.join(new_entries)

    def print_summary(self, output_dir: Path):
        """Print cloning statistics"""
        print("\n" + "="*60)
        print("CLONING SUMMARY")
        print("="*60)
        print(f"Output directory: {output_dir}")
        print(f"\nAssets Downloaded:")
        print(f"  HTML files:     {self.stats['html_files']}")
        print(f"  CSS files:      {self.stats['css_files']}")
        print(f"  JavaScript:     {self.stats['js_files']}")
        print(f"  Images:         {self.stats['images']}")
        print(f"  Fonts:          {self.stats['fonts']}")
        print(f"  Other assets:   {self.stats['other']}")
        print(f"  Failed:         {self.stats['failed']}")
        print(f"\nTotal assets:     {sum([v for k, v in self.stats.items()])}")
        print("="*60)


async def main():
    """Interactive CLI for the folder-based cloner"""
    print("=" * 60)
    print("CRAWL4AI FOLDER CLONER")
    print("JavaScript rendering + Organized folder structure")
    print("=" * 60)

    # Check for proxy file
    default_proxy_file = Path(__file__).parent / "proxies.txt"
    proxy_file = str(default_proxy_file) if default_proxy_file.exists() else None

    # Folder selection
    print("\n📁 Output Directory Selection")
    print("-" * 40)

    current_dir = Path.cwd()
    subdirs = [d for d in current_dir.iterdir() if d.is_dir() and not d.name.startswith('.')]
    subdirs.sort()

    print(f"Current location: {current_dir}")
    print("\nOptions:")
    print("  [0] Create new folder")

    for i, folder in enumerate(subdirs, start=1):
        print(f"  [{i}] Use existing folder: {folder.name}")

    # Get folder choice
    base_folder = None
    while True:
        choice = input(f"\nSelect option (0 to create new, 1-{len(subdirs)} for existing): ").strip()

        try:
            choice_num = int(choice)

            if choice_num == 0:
                folder_name = input("Enter name for new folder: ").strip()
                if not folder_name:
                    print("❌ No folder name provided, using current directory")
                    base_folder = current_dir
                else:
                    base_folder = current_dir / folder_name
                    base_folder.mkdir(exist_ok=True)
                    print(f"✅ Created folder: {base_folder}")
                break

            elif 1 <= choice_num <= len(subdirs):
                base_folder = subdirs[choice_num - 1]
                print(f"✅ Will save clones to: {base_folder}")
                break

            else:
                print(f"❌ Invalid choice. Please enter 0 or 1-{len(subdirs)}")

        except ValueError:
            if choice:
                base_folder = Path(choice)
                base_folder.mkdir(parents=True, exist_ok=True)
                print(f"✅ Using custom path: {base_folder}")
                break
            else:
                print("❌ Invalid input. Please enter a number or path")

    # Initialize cloner
    cloner = Crawl4AIFolderCloner(proxy_file=proxy_file)

    # Main cloning loop
    print("\n" + "=" * 60)
    print("Ready to clone pages!")
    print("Enter URLs to clone (or 'exit'/'quit' to stop)")
    print("=" * 60)

    clone_count = 0
    while True:
        url = input("\n🌐 Enter URL to clone (or 'exit' to quit): ").strip()

        if not url or url.lower() in ['exit', 'quit', 'q']:
            print(f"\n👋 Exiting. Total pages cloned: {clone_count}")
            break

        # Add https:// if no protocol specified
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url

        # Generate output directory
        output_dir = cloner.generate_output_folder(url, base_folder)

        # Clone the page
        success = await cloner.clone_page(url, output_dir)

        if success:
            clone_count += 1
            print(f"\n✅ Clone #{clone_count} completed!")
        else:
            print(f"\n❌ Cloning failed for {url}")

        print("\n" + "-" * 60)

    print("\n✨ Cloning complete!")


if __name__ == "__main__":
    asyncio.run(main())
