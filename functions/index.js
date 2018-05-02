/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  //C'est function qui est déployé dans le bot! intentTest est rappelé en ligne 68
  function intentTest(agent) {
    agent.add('Hello Guizmo!');
    agent.add(new Card{
      tilte: 'Guizmo est marrant',
      imageUrl: 'http://www.posepartagemedia.com/images/ctrb/IMG0115-w800.jpg',
      text: 'Ce chat est mortel',
      buttonText: 'Voir plus',
      buttonUrl: 'https://firebasestorage.googleapis.com/v0/b/yvette.appspot.com/o/guizmo.jpg?alt=media&token=645fc1f3-e3cc-49d3-8079-50c4c3371039'
    })
  }
  // // // Uncomment and edit to make your own intent handler
  // intentMap.set('New Intent', yourFunctionHandler);
  // // // below to get this funciton to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);

  //intentMap.set => appel l'intent configuré dans Dialogflow, ensuite la string est = au nom de l'entité configuré dans le bot.
  intentMap.set('new.intent.test', intentTest)
  // intentMap.set('your intent name here', yourFunctionHandler);
  agent.handleRequest(intentMap);
});
