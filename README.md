# meating-master

- Make every meeting better by indepth analytics of who is speaking and who interrupts others.

### 3 steps to run (work in progress)
- Frontend
  - `cd frontend`
  - `yarn install`
  - `yarn start`
- Api
  - `cd api`
  - `yarn install`
  - `DISCORD_SECRET=<bot_secret>`
  - Set bot id to src/constants.js
  - `yarn start`
- Audio recognition
  - `cd	audio_recognition`
  - `pip3 install -r requirements.txt`
  - `cd src`
  - `python3 main.py`

### Usage
1. Connect bot to server:
  ![Connect bot](https://cdn.discordapp.com/attachments/711247415881236560/711608677580275742/Screenshot_2020-05-17_at_17.58.46.png)
  
2. Add to voice channel
3. Enjoy!
  ![Watch stats](https://cdn.discordapp.com/attachments/711247415881236560/711608500052033556/Screenshot_2020-05-17_at_17.58.03.png)



