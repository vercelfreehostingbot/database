SERVER.SHODNS.IN - VERCEL MYSQL CONNECTION TESTER
================================================

এই ZIP-টি Vercel-এর জন্য তৈরি। এটি শুধু HTML নয়:
- index.html = ওয়েব পেজ
- api/check.js = Vercel Node.js Serverless Function
- mysql2 = MySQL সংযোগের লাইব্রেরি

DEPLOY:
1. ZIP extract করুন।
2. পুরো project GitHub repository-তে upload করুন।
3. Vercel > Add New > Project থেকে repository Import করুন।
4. Framework Preset: Other রাখুন।
5. Deploy করুন।

অত্যন্ত জরুরি Vercel Environment Variable:
Vercel Project > Settings > Environment Variables-এ যোগ করুন:

Name: DB_ALLOWED_HOSTS
Value: আপনার অনুমোদিত MySQL hostname

উদাহরণ:
mysql.example.com

একাধিক অনুমোদিত host হলে comma দিয়ে লিখুন:
mysql.example.com,db.example.net

তারপর Redeploy করুন।

ব্যবহার:
- পেজে Database Host হিসেবে allowlist-এ থাকা hostname দিন।
- Database Name, Username ও Password দিন।
- Check Connection চাপুন।

গুরুত্বপূর্ণ:
- localhost সাধারণত Vercel-এর MySQL নয়। আপনার hosting provider-এর Remote MySQL hostname ব্যবহার করুন।
- Hosting panel-এ Remote MySQL Access-এ Vercel থেকে সংযোগ অনুমোদন করতে হতে পারে।
- কিছু shared hosting বাইরের সার্ভার থেকে MySQL connection বন্ধ রাখে।
- এই endpoint কেবল DB_ALLOWED_HOSTS-এ থাকা host-এ সংযোগ করতে পারে; এটি নিরাপত্তার জন্য।
- এটি credentials ডাটাবেজে সংরক্ষণ বা server log-এ লেখে না।
- শুধু নিজের/অনুমোদিত ডাটাবেজ পরীক্ষা করুন।
- MySQL connection-এর জন্য outbound TCP 3306 আপনার hosting provider অনুমোদন করতে হবে।
