# How to test
* Go to front/ folder and run :
   - npm install
   - npm run dev
   
* Go to back/ folder and run :
   - npm install 
   - npm run start:dev
   
After running the back-end, run : 'docker compose up -d', then : 'npx prisma generate' and finally : 'npx prisma migrate dev'
Go to localhost:5173 and start testing. 
