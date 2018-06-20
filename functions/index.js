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

// Initialize DB Connection
const admin = require('firebase-admin');
admin.initializeApp()

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  const REQUEST_PERMISSION_ACTION = 'request_permission';

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // Retrieve Data from users
  function savedName(agent) {
    const nameParam = agent.parameters.name;
    const name = nameParam;

    agent.add('Thank you, ' + name + '!');

    return admin.database().ref('/users').push({name: name}).then((snapshot) => {
      console.log('database write sucessful: ' + snapshot.ref.toString());
    });
  }

  function requestPermission(agent) {
    agent.askForPermissions('To Locate You')
  }

  //Intent des recettes individuelles!
  function intentReceips(agent) {
    const receipId = agent.parameters.receips;

    if (receipId === `Omelette`){
        agent.add('Les oeufs brouillés préférés de mes petits fils!');
        agent.add(new Card({
          title: 'Omelette Aux Champignons',
          imageUrl: 'https://image.afcdn.com/recipe/20131009/59997_w420h344c1cx1345cy938.jpg',
          subtitle: 'Temps: 20 min',
          text: 'Très Facile. Bon Marché.  4 Personnes. Végétarien',
          buttonText: 'Préparer mon panier',
          buttonUrl: 'https://firebasestorage.googleapis.com/v0/b/yvette.appspot.com/o/Receips%2FOmelette%20Aux%20Champignons.png?alt=media&token=78603780-cc82-4c09-a14b-5a05ede4775b'
        })
      );

    } else if (receipId === `Lasagne`) {
        agent.add('Voici ma méilleure recette!');
        agent.add(new Card({
          title: 'Lasagne d\'Yvette',
          imageUrl: 'https://image.afcdn.com/recipe/20130909/25256_w420h344c1cx1456cy2184.jpg',
          subtitle: 'Temps: 1h05',
          text: 'Très Facile. Bon Marché.  6 personnes. Viande.',
          buttonText: 'Préparer mon panier',
          buttonUrl: 'https://firebasestorage.googleapis.com/v0/b/yvette.appspot.com/o/Receips%2FLasagne.png?alt=media&token=6d2096d8-29db-4500-8126-cd3d394ca8d9'
        })
      );
    } else if (receipId === `Saumon`) {
        agent.add('Voici ma méilleure recette!');
        agent.add(new Card({
          title: 'Saumon à l\'Échalote',
          imageUrl: 'https://image.afcdn.com/recipe/20131028/944_w420h344c1cx1808cy2620.jpg',
          subtitle: 'Temps: 25 min',
          text: 'Très Facile. Bon Marché.  4 personnes. Poisson.',
          buttonText: 'Préparer mon panier',
          buttonUrl: 'https://firebasestorage.googleapis.com/v0/b/yvette.appspot.com/o/Receips%2FSaumon.png?alt=media&token=fb862642-b9d4-49cf-a86b-dd076c1f871e'
        })
      );
    } else if (receipId === `Poivrons`) {
        agent.add('Les légumes sont importants pour ton alimentation!');
        agent.add(new Card({
          title: 'Poivrons Farcis',
          imageUrl: 'https://image.afcdn.com/recipe/20130924/61603_w420h344c1cx2080cy1456.jpg',
          subtitle: 'Temps: 1h15',
          text: 'Très Facile. Bon Marché.  4 personnes. Viande.',
          buttonText: 'Préparer mon panier',
          buttonUrl: 'https://firebasestorage.googleapis.com/v0/b/yvette.appspot.com/o/Receips%2FPoivrons%20Farcis.png?alt=media&token=79322be3-3813-411b-b822-731a6957217a'
        })
      );
    } else if (receipId === `Poulet`) {
        agent.add('Ne passe pas à côté de cette recette qui vient du Sud!');
        agent.add(new Card({
          title: 'Poulet Basquaise',
          imageUrl: 'https://image.afcdn.com/recipe/20161116/7224_w600.jpg',
          subtitle: 'Temps: 1h20',
          text: 'Facile. Coût Moyen.  6 personnes. Poulet.',
          buttonText: 'Préparer mon panier',
          buttonUrl: 'https://firebasestorage.googleapis.com/v0/b/yvette.appspot.com/o/Receips%2FPoulet%20Basquaise.png?alt=media&token=55270a86-6511-49a0-a57f-94c2c8b7872f'
        })
      );
    } else if (receipId === `Salade`) {
        agent.add('Rien de mieux pour ton régime!');
        agent.add(new Card({
          title: 'Salade César Au Poulet Light',
          imageUrl: 'https://image.afcdn.com/recipe/20130621/54428_w420h344c1cx944cy1338.jpg',
          subtitle: 'Temps: 30 min',
          text: 'Très Facile. Bon Marché.  4 personnes. Poulet.',
          buttonText: 'Préparer mon panier',
          buttonUrl: 'https://firebasestorage.googleapis.com/v0/b/yvette.appspot.com/o/Receips%2FSalade%20Ce%CC%81sar.png?alt=media&token=c52751af-3775-4d46-843e-4788fc987d07'
        })
      );
    }
 }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  //intentMap.set('REQUEST_PERMISSION_ACTION', requestPermission);
  //intentMap.set('market_location', marketLocation);
  intentMap.set('intent.test', savedName);
  intentMap.set('receip.intent', intentReceips);
  agent.handleRequest(intentMap);
});
