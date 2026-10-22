WebMotion রেন্ডার প্রজেক্ট (Remotion)

নিজের কম্পিউটারে:
  npm install
  npm run preview     (প্রিভিউ, ব্রাউজারে localhost:3000)
  npm run web         (Websitesdeal ভিডিও -> out/websitesdeal.mp4)
  npm run snk         (SNK কোর্স ভিডিও -> out/snk-course.mp4)
  npm run render      (project.json থেকে আপনার নিজের প্রকল্প -> out/video.mp4)

পরে সার্ভারে (VPS) নিলে:
  ১. সার্ভারে Node.js (২০ বা নতুন) বসান, এই ফোল্ডার কপি করুন।
  ২. npm install চালান, তারপর একই npm run কমান্ডে ভিডিও বানান।
  ৩. Remotion-এর রেন্ডার ব্রাউজার (Chrome) চালাতে সার্ভারে কিছু লাইব্রেরি লাগতে পারে। Remotion-এর ডকুমেন্টেশনে "Linux dependencies" দেখুন।
  ৪. সার্ভারে প্রয়োজনীয় RAM/CPU আমি নিশ্চিত না, প্রদানকারীর পরামর্শ ও Remotion-এর ডকুমেন্টেশন দেখে ঠিক করুন।
  ৫. এডিটর থেকে সরাসরি রেন্ডার করতে একটা ছোট API লাগবে, সেটা পরের ধাপে বানানো হবে।
