/**
 * Copyright 2023 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Discovery } from '@firebolt-js/sdk';
// import { Content } from '@firebolt-js/discovery-sdk'
import { testDataHandler, filterExamples } from '../utils/Utils';

const MOCK_PURCHASED_CONTENT = {
  data: {
    totalCount: 1,
    expires: '2025-01-01T00:00:00.000Z',
    entries: [
      {
        identifiers: {
          entityId: '345',
        },
        entityType: 'program',
        programType: 'movie',
        title: 'Cool Runnings',
        synopsis: 'When a Jamaican sprinter is disqualified from the Olympic Games, he enlists the help of a dishonored coach to start the first Jamaican Bobsled Team.',
        releaseDate: '1993-01-01T00:00:00.000Z',
        contentRatings: [
          {
            scheme: 'US-Movie',
            rating: 'PG',
          },
          {
            scheme: 'CA-Movie',
            rating: 'G',
          },
        ],
      },
    ],
  },
};

const MOCK_ENITY_INFO = {
  expires: '2025-01-01T00:00:00.000Z',
  entity: {
    identifiers: {
      entityId: 'THIS_SHOULD_BE_REPLACED',
    },
    entityType: 'program',
    programType: 'movie',
    title: 'Cool Runnings',
    synopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pulvinar sapien et ligula ullamcorper malesuada proin libero nunc.',
    releaseDate: '1993-01-01T00:00:00.000Z',
    contentRatings: [
      {
        scheme: 'US-Movie',
        rating: 'PG',
      },
      {
        scheme: 'CA-Movie',
        rating: 'G',
      },
    ],
    waysToWatch: [
      {
        identifiers: {
          assetId: '123',
        },
        expires: '2025-01-01T00:00:00.000Z',
        entitled: true,
        entitledExpires: '2025-01-01T00:00:00.000Z',
        offeringType: 'buy',
        price: 2.99,
        videoQuality: ['UHD'],
        audioProfile: ['dolbyAtmos'],
        audioLanguages: ['en'],
        closedCaptions: ['en'],
        subtitles: ['es'],
        audioDescriptions: ['en'],
      },
    ],
  },
};
export default class DiscoveryInvoker {
  purchasedContent() {
    return new Promise((resolve) => {
      Discovery.purchasedContent(async (req) => {
        if (req == null) {
          // don't care about the listening ack
          resolve({ message: 'purchasedContent has been requested' });
          return MOCK_PURCHASED_CONTENT;
        } else {
          const PURCHASEDCONTENTEXAMPLES = testDataHandler('content', 'PURCHASEDCONTENT');
          if (!process.env.scenario && process.env.scenario != false) {
            const limit = req.limit;
            const programType = req.programType;
            const offeringType = req.offeringType;
            const purchasedContent = PURCHASEDCONTENTEXAMPLES.PURCHASEDCONTENT_POSITIVE;

            if (limit) {
              const filteredList = filterExamples(PURCHASEDCONTENTEXAMPLES.PURCHASEDCONTENT_POSITIVE.entries, programType, offeringType);
              const entries = filteredList.slice(-limit);
              purchasedContent.entries = entries;
              return purchasedContent;
            }
          } else {
            const PURCHASEDCONTENTEXAMPLES_NEG = PURCHASEDCONTENTEXAMPLES;
            delete PURCHASEDCONTENTEXAMPLES_NEG.PURCHASEDCONTENT_POSITIVE;
            const purchasedContent = PURCHASEDCONTENTEXAMPLES_NEG;
            return purchasedContent[process.env.purchasedContentTestCase];
          }
        }
        return null;
      });
      resolve(true);
    });
  }

  entityInfo() {
    return new Promise((resolve) => {
      Discovery.entityInfo(async (req) => {
        if (req == null) {
          // don't care about the listening ack
          resolve({ message: 'entityInfo has been requested' });
          const rv = { ...MOCK_ENITY_INFO };
          rv.entity.identifiers.entityId = req.entityId;
          return rv;
        } else {
          const ENTITYINFOEXAMPLES = testDataHandler('content', 'CONTENT');
          const entityInfoLength = Object.keys(ENTITYINFOEXAMPLES).length;
          for (let entityInfoObj = 0; entityInfoObj < entityInfoLength; entityInfoObj++) {
            const entityInfoValues = Object.values(ENTITYINFOEXAMPLES);
            if (entityInfoValues[entityInfoObj].entity && entityInfoValues[entityInfoObj].entity.identifiers && entityInfoValues[entityInfoObj].entity.identifiers.entityId) {
              if (req.entityId == entityInfoValues[entityInfoObj].entity.identifiers.entityId) {
                return entityInfoValues[entityInfoObj];
              }
            }
          }
        }
        return null;
      });
      resolve(true);
    });
  }
  // Commenting below methods as the APIs used have been deprecated from discovery sdk , can be uncommented when added as ripple-rpc APIs in future ticket

  // async getPurchasedContent (provider, parameters, options) {
  //   /** Use providers API to find a real app that is a provider, otherwise use the example */
  //   const allApps = await Content.providers()
  //   const supportedApps = allApps.filter(a => a.apis.indexOf('purchases') !== -1)
  //   let prov = supportedApps.length > 0 ? supportedApps[0].id : provider
  //   return Content.purchases(prov, parameters, options)
  // }

  // async getEntityInfo (provider, parameters, options) {
  //   /** Use providers API to find a real app that is a provider, otherwise use the example */
  //   const allApps = await Content.providers()
  //   const supportedApps = allApps.filter(a => a.apis.indexOf('entity') !== -1)
  //   let prov = supportedApps.length > 0 ? supportedApps[0].id : provider
  //   return Content.entity(prov, parameters, options)
  // }
}
