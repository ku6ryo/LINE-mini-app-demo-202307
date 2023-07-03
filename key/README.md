This directory has scripts to generate JWT (チャネルアクセストークンv2.1) for LINE Messaging API based on [this doc](https://developers.line.biz/ja/docs/messaging-api/generate-json-web-token/).

# Steps
1. Generate a private key and a public key. [Reference](https://developers.line.biz/ja/docs/messaging-api/generate-json-web-token/#generate-a-key-pair-for-the-assertion-signing-key)
2. Save the private key as `private.key` in this directory.
3. Generate kid. [Reference](https://developers.line.biz/ja/docs/messaging-api/generate-json-web-token/#register-public-key-and-get-kid)
4. Get channel ID from LINE Developers Console.
5. Set channel ID and kid in `.env` file. Please check `.env.sample` file.
6. `yarn install`
7. `yarn gen`