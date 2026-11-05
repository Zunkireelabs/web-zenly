#!/usr/bin/env bash
# Submit the live sitemap's URLs to IndexNow.
#
# IndexNow pushes URLs to Bing, Yandex, Seznam and Naver in one call. Bing's
# index feeds ChatGPT search and Microsoft Copilot, so this is the fastest route
# to being visible to those assistants. Google does NOT participate in
# IndexNow — Google only picks pages up through Search Console and normal
# crawling, so this script is not a substitute for submitting the sitemap there.
#
# The key is already hosted at https://zennly.io/10666449c543422a85b0f3a9700e1039.txt
# (the file lives at src/10666449c543422a85b0f3a9700e1039.txt and is copied
# through by .eleventy.js). The key file must stay reachable or submissions are
# rejected.
#
# Usage:
#   dev_tools/indexnow-submit.sh              # submit every URL in the live sitemap
#   dev_tools/indexnow-submit.sh URL [URL...] # submit specific URLs only
#
# Run it AFTER a deploy, never before: submitting a URL that 404s is worse than
# not submitting it.
set -euo pipefail

HOST="zennly.io"
KEY="10666449c543422a85b0f3a9700e1039"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
ENDPOINT="https://api.indexnow.org/indexnow"

# The key file must be live, or every submission is rejected.
key_status=$(curl -s -o /dev/null -w '%{http_code}' "$KEY_LOCATION")
if [ "$key_status" != "200" ]; then
  echo "ERROR: key file $KEY_LOCATION returned $key_status, expected 200." >&2
  echo "IndexNow will reject the submission. Deploy the key file first." >&2
  exit 1
fi

if [ "$#" -gt 0 ]; then
  urls=("$@")
else
  # Portable: macOS ships bash 3.2, which has no `mapfile`.
  urls=()
  while IFS= read -r line; do
    [ -n "$line" ] && urls+=("$line")
  done < <(curl -sf "https://${HOST}/sitemap.xml" \
    | grep -o '<loc>[^<]*</loc>' | sed 's#</\?loc>##g')
fi

if [ "${#urls[@]}" -eq 0 ]; then
  echo "ERROR: no URLs to submit." >&2
  exit 1
fi

echo "Submitting ${#urls[@]} URLs for ${HOST}..."

payload=$(printf '%s\n' "${urls[@]}" | python3 -c '
import json,sys
urls=[l.strip() for l in sys.stdin if l.strip()]
print(json.dumps({
  "host": "'"$HOST"'",
  "key": "'"$KEY"'",
  "keyLocation": "'"$KEY_LOCATION"'",
  "urlList": urls,
}))')

submit() {
  curl -s -o /tmp/indexnow-response.txt -w '%{http_code}' --max-time 30 \
    -X POST "$1" \
    -H 'Content-Type: application/json; charset=utf-8' \
    -d "$payload"
}

# 5xx from the IndexNow front door is common and transient ("Bing Webmaster
# services could not be reached"). Retry before giving up.
status=""
for attempt in 1 2 3; do
  status=$(submit "$ENDPOINT")
  case "$status" in
    200|202) break ;;
    5*) echo "  attempt $attempt: HTTP $status (transient), retrying..." >&2; sleep 5 ;;
    *) break ;;
  esac
done

echo "HTTP $status"
case "$status" in
  200|202)
    echo "Accepted by $ENDPOINT."
    echo "IndexNow does not report indexing status — check Bing Webmaster Tools in a few days."
    echo "NOTE: Google does not participate in IndexNow. Submit the sitemap in Search Console separately."
    ;;
  400) echo "Bad request: the JSON or a URL is malformed." >&2; cat /tmp/indexnow-response.txt >&2; exit 1 ;;
  403) echo "Key rejected: $KEY_LOCATION must contain exactly '$KEY'." >&2; exit 1 ;;
  422) echo "URLs did not match the host, or the key does not match." >&2; cat /tmp/indexnow-response.txt >&2; exit 1 ;;
  429) echo "Rate limited. Wait and retry." >&2; exit 1 ;;
  5*)  echo "IndexNow still 5xx after 3 attempts. Transient on their side; re-run later." >&2; exit 1 ;;
  *)   echo "Unexpected response:" >&2; head -c 400 /tmp/indexnow-response.txt >&2; exit 1 ;;
esac
