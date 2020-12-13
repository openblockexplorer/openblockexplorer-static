/**
 * @file MockServer
 * @copyright Copyright (c) 2018-2020 Dylan Miller and openblockexplorer contributors
 * @license MIT License
 */

import { sha3_256 } from 'js-sha3';
import Constants from '../constants';
import getRandomInt from './getRandomInt';
import getRandomNumber from './getRandomNumber';

/**
 * Provides a simulation of a server, database, and blockchain network.
 */
class MockServer {
  /**
   * Create a MockServer object.
   * @constructor
   */
  constructor() {
    // Starting block height.
    const dateToday = new Date();
    const dateStart = new Date(
      dateToday.getFullYear(),
      dateToday.getMonth() - Constants.STATIC_START_MONTHS_BEFORE_TODAY,
      1);
    const elapsedMs = dateToday.getTime() - dateStart.getTime();
    this.blockHeight = Math.floor(elapsedMs / Constants.STATIC_BLOCK_TIME_MS);

    // Database simulation members.
    this.blocks = [];
    this.blocksMapByHeight = new Map();
    this.transactions = [];
    this.transactionsMapByHash = new Map();
    this.transactionsPerDays = [
      310337, 313589, 290827, 297579, 307336, 309952, 297193, 290252, 298334, 299165, 295980,
      314983, 304301, 310709, 316025, 301995, 290314, 304104, 300348, 297674, 316931, 301925,
      316524, 290471, 303144, 304190, 296886, 317507, 295057, 295209, 300387, 311270, 291703,
      315558, 295660, 302128, 298574, 296363, 302307, 313384, 309288, 309477, 296264, 303867,
      316629, 298503, 312869, 310598, 309085, 315671, 307676, 308296, 290160, 310894, 288048,
      316307, 309786, 295976, 294780, 294503, 294628, 290956, 311250, 299018, 295754, 299098,
      302487, 302264, 291887, 295181, 315754, 295970, 312541, 291290, 297825, 312461, 292620,
      303766, 290851, 303907, 299573, 289672, 312845, 287575, 289242, 292281, 305656, 302450,
      308555, 294846, 305088, 299615, 317490, 293178, 306621, 299233, 310967, 288450, 289391,
      304788];
    this.prices = [
      16.6281278, 17.58357529, 19.93815045, 20.06231797, 20.09033456, 15.60569456, 20.73913126,
      23.8023505, 23.70194863, 25.06192243, 23.03510121, 21.09756818, 21.3849601, 18.45689417,
      19.98396848, 20.09016498, 19.17659903, 20.69405557, 23.17878297, 27.48400726, 28.59779156,
      29.94846584, 31.36078032, 35.92982346, 28.76324295, 27.15187109, 26.89085403, 23.93834545,
      23.2289697, 23.87426273, 18.04466817, 17.38999974, 19.29365877, 21.00631071, 19.63032521,
      19.6584171, 19.62915806, 17.33868885, 17.28368522, 16.65447174, 16.80148965, 16.11220961,
      15.54426834, 14.6635775, 13.79773345, 13.88375094, 14.21692831, 16.27441916, 16.0240564,
      16.19392927, 17.23121829, 17.06375764, 8.76220576, 13.52029943, 12.91980016, 13.19695492,
      17.62882155, 16.37329418, 12.70904661, 12.82851447, 13.97149339, 14.27648811, 12.04525542,
      11.8032347, 13.87211414, 13.9170336, 13.36739245, 13.24298631, 12.60285729, 12.24952636,
      12.32249269, 11.94716386, 11.96618666, 12.58966848, 10.80896246, 14.38125675, 14.73902796,
      13.10992837, 12.91440305, 13.18443959, 13.385099, 13.08299092, 13.62372015, 15.17900978,
      12.97646833, 12.99243794, 14.34198228, 14.58535171, 13.82917744, 14.82477908, 15.64444703,
      13.93375996, 16.53689396, 17.84700421, 16.86642115, 14.27428707, 15.16815528, 17.18411013,
      14.61807672, 16.48574617
    ];
    this.price = 0;


    // Add the blocks.
    for (let i = 0; i < Constants.STATIC_NUM_BLOCKS; i++) {
      // Progressively backdate the initial blocks.
      const date =
        new Date(Date.now() - Constants.STATIC_BLOCK_TIME_MS * (Constants.STATIC_NUM_BLOCKS - i));
      this.addBlock(date);
    }
  }

  /**
   * Resolver for the blocks query.
   * @param {String} first The number of blocks to get, seeking forward.
   * @param {Number} orderBy The order of the blocks.
   * @return {Array} The resolved array of blocks.
   * @public
   * 
   * Note that orderBy is always height_DESC.
   * queryBlocks Example:
   *    Request: {"operationName":"Blocks","variables":{"first":8},"query":"query Blocks($first: Int) {\n  blocks(first: $first, orderBy: height_DESC) {\n    id\n    height\n    timestamp\n    numTransactions\n  }\n}\n"}
   *    Response: {"data":{"blocks":[{"id":"ckhxppgjr3pe30782bp760oii","height":1276552,"timestamp":"2020-11-25T17:59:03.521Z","numTransactions":4},{"id":"ckhxpp8uk3pd70782ty0q3six","height":1276551,"timestamp":"2020-11-25T17:58:53.520Z","numTransactions":1},{"id":"ckhxpp1703pcj07825f95fsd0","height":1276550,"timestamp":"2020-11-25T17:58:43.520Z","numTransactions":3},{"id":"ckhxpotgf3pbv0782onq5rak0","height":1276549,"timestamp":"2020-11-25T17:58:33.519Z","numTransactions":2},{"id":"ckhxpolqg3pba078294zwjhmq","height":1276548,"timestamp":"2020-11-25T17:58:23.519Z","numTransactions":2},{"id":"ckhxpoe0q3par07827im0i11u","height":1276547,"timestamp":"2020-11-25T17:58:13.519Z","numTransactions":0},{"id":"ckhxpo6ap3pa60782cop99tea","height":1276546,"timestamp":"2020-11-25T17:58:03.518Z","numTransactions":2},{"id":"ckhxpnykj3p9d0782dw6dnqgs","height":1276545,"timestamp":"2020-11-25T17:57:53.518Z","numTransactions":3}]}}  
   */
  resolveQueryBlocks(first, orderBy) {
    // Add a block for every blocks query made by the BlocksSlideTable, which polls for blocks every
    // Constants.STATIC_BLOCK_TIME_MS milliseconds. This means that new blocks/transactions are only
    // added when the user is on the HomePage, which is acceptable for the purposes of mocking.
    this.addBlock(new Date());

    if (first != null) {
      const blocks = this.getObjectsSeekForward(this.blocks, first, null);
      return blocks.map((block) => {
        return {
          id: block.id,
          height: block.height,
          timestamp: block.timestamp.toUTCString(),
          numTransactions: block.transactions.length
        };
      });
    }
    else
      return [];
  }

  /**
   * Resolver for the blocksConnection query.
   * @param {Object} where A BlockWhereInput object specifying conditions that must be met.
   * @param {Number} orderBy A BlockOrderByInput value specifying the desired order of block
   * objects.
   * @param {Number} skip The number of block objects to skip.
   * @param {String} after Get the block objects after the object with this ID.
   * @param {String} before Get the block objects before the object with this ID.
   * @param {Number} first The number of block objects to get in the forward direction.
   * @param {Number} last The number of block objects to get in the backward direction.
   * @return {Object} The resolved BlocksConnection object.
   * @public
   *
   * Note that orderBy is always height_DESC, and skip is not used.
   * queryBlocksCount Example:
   *    Request: {"operationName":"BlocksConnection","variables":{"where":{"id_lte":"ckhts34mxc7h00734l1q9imie"}},"query":"query BlocksConnection($where: BlockWhereInput) {\n  blocksConnection(where: $where) {\n    aggregate {\n      count\n    }\n  }\n}\n"}
   *    Response: {"data":{"blocksConnection":{"aggregate":{"count":8635}}}}
   * queryBlocksConnection Examples:
   * Page 1:
   *    Request: {"operationName":"BlocksConnection","variables":{"first":10},"query":"query BlocksConnection($where: BlockWhereInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {\n  blocksConnection(where: $where, orderBy: height_DESC, skip: $skip, after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        id\n        height\n        timestamp\n        numTransactions\n      }\n    }\n    pageInfo {\n      startCursor\n      endCursor\n    }\n  }\n}\n"}
   *    Response: {"data":{"blocksConnection":{"edges":[{"node":{"id":"ckhts34mxc7h00734l1q9imie","height":1252764,"timestamp":"2020-11-22T23:54:35.662Z","numTransactions":1}},{"node":{"id":"ckhts2wwcc7gf0734pk8m8m9i","height":1252763,"timestamp":"2020-11-22T23:54:25.658Z","numTransactions":2}},{"node":{"id":"ckhts2p6oc7fx073497ql3w2k","height":1252762,"timestamp":"2020-11-22T23:54:15.658Z","numTransactions":1}},{"node":{"id":"ckhts2hgtc7f90734deqmmvc2","height":1252761,"timestamp":"2020-11-22T23:54:05.657Z","numTransactions":2}},{"node":{"id":"ckhts29q4c7ej0734h7g2fsvf","height":1252760,"timestamp":"2020-11-22T23:53:55.654Z","numTransactions":4}},{"node":{"id":"ckhts221oc7dp0734glsnerl3","height":1252759,"timestamp":"2020-11-22T23:53:45.649Z","numTransactions":3}},{"node":{"id":"ckhts1u9jc7cx07341jx2grsa","height":1252758,"timestamp":"2020-11-22T23:53:35.649Z","numTransactions":3}},{"node":{"id":"ckhts1mikc7ca0734pzvjzzxu","height":1252757,"timestamp":"2020-11-22T23:53:25.646Z","numTransactions":2}},{"node":{"id":"ckhts1etvc7bn0734rb9p6you","height":1252756,"timestamp":"2020-11-22T23:53:15.642Z","numTransactions":2}},{"node":{"id":"ckhts173jc7az0734crodha27","height":1252755,"timestamp":"2020-11-22T23:53:05.641Z","numTransactions":3}}],"pageInfo":{"startCursor":"ckhts34mxc7h00734l1q9imie","endCursor":"ckhts173jc7az0734crodha27"}}}}
   * Page 2:
   *    Request: {"operationName":"BlocksConnection","variables":{"after":"ckhts173jc7az0734crodha27","first":10},"query":"query BlocksConnection($where: BlockWhereInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {\n  blocksConnection(where: $where, orderBy: height_DESC, skip: $skip, after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        id\n        height\n        timestamp\n        numTransactions\n      }\n    }\n    pageInfo {\n      startCursor\n      endCursor\n    }\n  }\n}\n"}
   *    Response: {"data":{"blocksConnection":{"edges":[{"node":{"id":"ckhts0zdsc7ag0734tqbsp50l","height":1252754,"timestamp":"2020-11-22T23:52:55.637Z","numTransactions":0}},{"node":{"id":"ckhts0rn5c79l0734phtrhfki","height":1252753,"timestamp":"2020-11-22T23:52:45.634Z","numTransactions":4}},{"node":{"id":"ckhts0jxzc78v0734kw2nds4v","height":1252752,"timestamp":"2020-11-22T23:52:35.634Z","numTransactions":3}},{"node":{"id":"ckhts0capc7860734p7q95bb5","height":1252751,"timestamp":"2020-11-22T23:52:25.638Z","numTransactions":3}},{"node":{"id":"ckhts04jjc77k0734vmpc0svq","height":1252750,"timestamp":"2020-11-22T23:52:15.629Z","numTransactions":1}},{"node":{"id":"ckhtrzwuac76z0734ax7mb4el","height":1252749,"timestamp":"2020-11-22T23:52:05.625Z","numTransactions":2}},{"node":{"id":"ckhtrzp5kc76f0734attwk7jl","height":1252748,"timestamp":"2020-11-22T23:51:55.622Z","numTransactions":1}},{"node":{"id":"ckhtrzhfbc75s07342bhrpww2","height":1252747,"timestamp":"2020-11-22T23:51:45.623Z","numTransactions":1}},{"node":{"id":"ckhtrz9oic75c07346ldd1mw7","height":1252746,"timestamp":"2020-11-22T23:51:35.598Z","numTransactions":0}},{"node":{"id":"ckhtrz1xvc74q0734th999l1w","height":1252745,"timestamp":"2020-11-22T23:51:25.597Z","numTransactions":1}}],"pageInfo":{"startCursor":"ckhts0zdsc7ag0734tqbsp50l","endCursor":"ckhtrz1xvc74q0734th999l1w"}}}}
   * Page last:
   *    Request: {"operationName":"BlocksConnection","variables":{"last":5},"query":"query BlocksConnection($where: BlockWhereInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {\n  blocksConnection(where: $where, orderBy: height_DESC, skip: $skip, after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        id\n        height\n        timestamp\n        numTransactions\n      }\n    }\n    pageInfo {\n      startCursor\n      endCursor\n    }\n  }\n}\n"}
   *    Response: {"data":{"blocksConnection":{"edges":[{"node":{"id":"ckhscopap7w6e0734oy5tc8uj","height":1244129,"timestamp":"2020-11-21T23:55:42.205Z","numTransactions":0}},{"node":{"id":"ckhscohk67w5p0734s9s6wfv3","height":1244128,"timestamp":"2020-11-21T23:55:32.197Z","numTransactions":4}},{"node":{"id":"ckhsco9ut7w4z0734qvixisa3","height":1244127,"timestamp":"2020-11-21T23:55:22.189Z","numTransactions":3}},{"node":{"id":"ckhsco2567w4c0734n4c2qhm0","height":1244126,"timestamp":"2020-11-21T23:55:12.181Z","numTransactions":4}},{"node":{"id":"ckhscnuev7w3j0734lhpvdhi5","height":1244125,"timestamp":"2020-11-21T23:55:02.173Z","numTransactions":2}}],"pageInfo":{"startCursor":"ckhscopap7w6e0734oy5tc8uj","endCursor":"ckhscnuev7w3j0734lhpvdhi5"}}}}
   * Page last - 1:
   *    Request: {"operationName":"BlocksConnection","variables":{"before":"ckhscopap7w6e0734oy5tc8uj","last":10},"query":"query BlocksConnection($where: BlockWhereInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {\n  blocksConnection(where: $where, orderBy: height_DESC, skip: $skip, after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        id\n        height\n        timestamp\n        numTransactions\n      }\n    }\n    pageInfo {\n      startCursor\n      endCursor\n    }\n  }\n}\n"}
   *    Response: {"data":{"blocksConnection":{"edges":[{"node":{"id":"ckhscquic7wd107347m6ietir","height":1244139,"timestamp":"2020-11-21T23:57:22.269Z","numTransactions":4}},{"node":{"id":"ckhscqmsm7wc90734btuxhcha","height":1244138,"timestamp":"2020-11-21T23:57:12.261Z","numTransactions":4}},{"node":{"id":"ckhscqf2a7wbk0734kmnrftrl","height":1244137,"timestamp":"2020-11-21T23:57:02.253Z","numTransactions":2}},{"node":{"id":"ckhscq7dg7was0734j31d9o8m","height":1244136,"timestamp":"2020-11-21T23:56:52.253Z","numTransactions":4}},{"node":{"id":"ckhscpzlt7wa00734u3xqs4o1","height":1244135,"timestamp":"2020-11-21T23:56:42.245Z","numTransactions":2}},{"node":{"id":"ckhscprw27w9h0734yp08q71i","height":1244134,"timestamp":"2020-11-21T23:56:32.237Z","numTransactions":0}},{"node":{"id":"ckhscpk6g7w8z07348wuq2e0u","height":1244133,"timestamp":"2020-11-21T23:56:22.229Z","numTransactions":3}},{"node":{"id":"ckhscpcgq7w880734gwi0nem3","height":1244132,"timestamp":"2020-11-21T23:56:12.221Z","numTransactions":2}},{"node":{"id":"ckhscp4pw7w7l0734ugbc0atu","height":1244131,"timestamp":"2020-11-21T23:56:02.213Z","numTransactions":2}},{"node":{"id":"ckhscox2f7w6v07348hy1ckpr","height":1244130,"timestamp":"2020-11-21T23:55:52.213Z","numTransactions":1}}],"pageInfo":{"startCursor":"ckhscquic7wd107347m6ietir","endCursor":"ckhscox2f7w6v07348hy1ckpr"}}}}
   */
  resolveQueryBlocksConnection(where, orderBy, skip, after, before, first, last) {
    if (where != null && where.id_lte != null) {
      const count = this.getObjectIndex(where.id_lte) + 1;
      return {
        aggregate: {
          count: count
        }
      };
    }
    else
    {
      let blocks;
      if (first != null)
        blocks = this.getObjectsSeekForward(this.blocks, first, after);
      else if (last != null)
        blocks = this.getObjectsSeekBackward(this.blocks, last, before);
      else
        blocks = [];
      const edges = blocks.map((block) => {
        return {
          node: {
            id: block.id,
            height: block.height,
            timestamp: block.timestamp.toUTCString(),
            numTransactions: block.transactions.length
          }
        };
      });
      return {
        pageInfo: {
          startCursor: edges[0].node.id,
          endCursor: edges[edges.length - 1].node.id
        },
        edges: edges
      };
    }
  }

  /**
   * Resolver for the block query.
   * @param {Number} height The height of the block.
   * @return {Object} The resolved block object.
   * @public
   * 
   * queryBlock Example:
   *    Request: {"operationName":"Block","variables":{"height":1267930},"query":"query Block($height: Int!) {\n  block(height: $height) {\n    id\n    height\n    timestamp\n    numTransactions\n    transactions {\n      id\n      hash\n      amount\n    }\n  }\n}\n"}
   *    Response: {"data":{"block":{"id":"ckhwadgpqjsmt0734uy2t747n","height":1267930,"timestamp":"2020-11-24T18:02:03.401Z","numTransactions":1,"transactions":[{"id":"ckhwadgpyjsmu0734neznzzb0","hash":"0bed73ee12e1dd9d34ecedda1e72ce2a11b3a48d2708033433874d11b0e9008a","amount":7.019008343173587}]}}}
   */
  resolveQueryBlock(height) {
    const block = this.blocksMapByHeight.get(height);
    if (block === undefined)
      return null;
    else {
      const transactions = block.transactions.map((transaction) => {
        return {
          id: transaction.id,
          hash: transaction.hash,
          amount: transaction.amount
        };
      });
      return {
        id: block.id,
        height: block.height,
        timestamp: block.timestamp.toUTCString(),
        numTransactions: transactions.length,
        transactions: transactions
      };
    }
  }

  /**
   * Resolver for the transactions query.
   * @param {String} first The number of transactions to get, seeking forward.
   * @param {Number} orderBy The order of the transactions.
   * @return {Array} The resolved array of transactions.
   * @public
   *
   * Note that orderBy is always createdAt_DESC.
   * queryTransactions Example:
   *    Request: {"operationName":"Transactions","variables":{"first":8},"query":"query Transactions($first: Int) {\n  transactions(first: $first, orderBy: createdAt_DESC) {\n    id\n    hash\n    amount\n  }\n}\n"}
   *    Response: {"data":{"transactions":[{"id":"ckhxppgjv3pe407825o839umd","hash":"17fa54c9f3c10c64cc9b3c75d6909e55d79dafbf038daafb1b25dc3729833366","amount":783.2659455180377},{"id":"ckhxppgjw3pe50782orl0ytzk","hash":"e63b9e335429b00b341e30ccee2d827ae3456e7edb38dff47ab1bd9d3b10b0aa","amount":918.9608166770298},{"id":"ckhxppgjx3pe6078271tlgk14","hash":"d92adec80a8fbe37d973bfe3d6b7cdd5b264f001b341ba5a10e816062df539a0","amount":49.01553626339467},{"id":"ckhxppgjy3pe707828imox40y","hash":"9bea0a2c99b4d966bc9e9fb56f67d2dad6ffd92ed26c19684a4e8f230cce3962","amount":34.4047929442281},{"id":"ckhxpp8uo3pd80782rqex54ua","hash":"83be810b7fafe9542d84f41044aa3f00d74102b4915ffbc74aa75c28a2d800f9","amount":66.0907817392576},{"id":"ckhxpp1753pck0782o97g44hf","hash":"cdb3b8c07ab5759d4baeadb7d4d035396f802954c4364f3541d50b8771e31dfc","amount":39.380358833111686},{"id":"ckhxpp1763pcl0782nbnefzro","hash":"2b9ea9a96bf1e38bab375bab8fe021ff7009c841a766d419577d1d55fb9087fc","amount":3.817800690923789},{"id":"ckhxpp1773pcm07828eo77ap1","hash":"1fcd66f0e9fe56501c378045f5296cfdffaf0ef6a031026ab32e4a3677c70abb","amount":36.61436508030448}]}}
   */
  resolveQueryTransactions(first, orderBy) {
    if (first != null) {
      const transactions = this.getObjectsSeekForward(this.transactions, first, null);
      return transactions.map((transaction) => {
        return {
          id: transaction.id,
          hash: transaction.hash,
          amount: transaction.amount
        };
      });
    }
    else
      return [];
  }

  /**
   * Resolver for the transactionsConnection query.
   * @param {Object} where A TransactionWhereInput object specifying conditions that must be met.
   * @param {Number} orderBy A TransactionOrderByInput value specifying the desired order of
   * transaction objects.
   * @param {Number} skip The number of transaction objects to skip.
   * @param {String} after Get the transaction objects after the object with this ID.
   * @param {String} before Get the transaction objects before the object with this ID.
   * @param {Number} first The number of transaction objects to get in the forward direction.
   * @param {Number} last The number of transaction objects to get in the backward direction.
   * @return {Object} The resolved TransactionsConnection object.
   * @public
   *
   * Note that orderBy is always createdAt_DESC, and skip is not used.
   * queryTransactionsCount Example:
   *    Request: {"operationName":"TransactionsConnection","variables":{"where":{"id_lte":"ckhtl1944bm8v0734gri9firh"}},"query":"query TransactionsConnection($where: TransactionWhereInput) {\n  transactionsConnection(where: $where) {\n    aggregate {\n      count\n    }\n  }\n}\n"}
   *    Response: {"data":{"transactionsConnection":{"aggregate":{"count":17200}}}}
   * queryTransactionsConnection Examples:
   * Page 1:
   *    Request: {"operationName":"TransactionsConnection","variables":{"first":10},"query":"query TransactionsConnection($where: TransactionWhereInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {\n  transactionsConnection(where: $where, orderBy: createdAt_DESC, skip: $skip, after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        id\n        hash\n        amount\n      }\n    }\n    pageInfo {\n      startCursor\n      endCursor\n    }\n  }\n}\n"}
   *    Response: {"data":{"transactionsConnection":{"edges":[{"node":{"id":"ckhtl1944bm8v0734gri9firh","hash":"d01aa07b8cdeda1be8271e87e601aed696de7d729fa85209a5273ed742f5947a","amount":65.13928279116135}},{"node":{"id":"ckhtl1945bm8w0734mux02esw","hash":"fdd711d4b9c28db6be1a96f44edd999d1e29df0bcbe7494bfd6d293eb8fa75ed","amount":196.35590266865196}},{"node":{"id":"ckhtl1946bm8x0734wz4v34nd","hash":"496016878304998bd4fa87f293a58f30dbd70c596dd09c1550a135867be356f0","amount":681.2539568661601}},{"node":{"id":"ckhtl1946bm8y0734nxl7rg9d","hash":"72992e002193157aeb4f8fd47f251a09f0c9dd615d83844a986edf40df266d04","amount":271.210356664776}},{"node":{"id":"ckhtl0togbm7r07347piauodt","hash":"5b17eb6d1dd98fc5aca465f205e1e52e193df0fac688d3ee8456af33a3d080f1","amount":732.9834847232742}},{"node":{"id":"ckhtl0tohbm7s0734hqmlfh69","hash":"a7765ee43fcbf0ca31ce3dfe48e22e5bfdc8e9c06a716eb403ed64c9a2e412ec","amount":17.89014389860158}},{"node":{"id":"ckhtl0tohbm7t0734whbyrhw0","hash":"8d1b4001237d89528ad4f404cb5cb8648ab8555b88d3b2721720740ee548b647","amount":151.65606733229734}},{"node":{"id":"ckhtl0lxobm6t07344uu2mbmt","hash":"3c8df8500b24b4a7d9ccbe50d2e651c443d19ee5127b1171745173d42da472de","amount":139.09886256367065}},{"node":{"id":"ckhtl0lxobm6u07349b5q7vml","hash":"d574ccf505d73b895441d4f04353200a673e38d84744c0fbea2d658897352ec9","amount":987.5693929357903}},{"node":{"id":"ckhtl0lxpbm6v0734wg1n14xp","hash":"69dadef00b945c92af745da2fdf450d4f31c86ea28ce89b6f0ca50e93e995245","amount":49.84602630455984}}],"pageInfo":{"startCursor":"ckhtl1944bm8v0734gri9firh","endCursor":"ckhtl0lxpbm6v0734wg1n14xp"}}}}
   * Page 2:
   *    Request: {"operationName":"TransactionsConnection","variables":{"after":"ckhtl0lxpbm6v0734wg1n14xp","first":10},"query":"query TransactionsConnection($where: TransactionWhereInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {\n  transactionsConnection(where: $where, orderBy: createdAt_DESC, skip: $skip, after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        id\n        hash\n        amount\n      }\n    }\n    pageInfo {\n      startCursor\n      endCursor\n    }\n  }\n}\n"}
   *    Response: {"data":{"transactionsConnection":{"edges":[{"node":{"id":"ckhtl0e7vbm6107346k1dihlk","hash":"ba03eabd13550fd92033bf26e34bb12ede7a9dba2f7f11b3f4ae4f234ab496fa","amount":31.102718972358854}},{"node":{"id":"ckhtl0e7wbm620734yl1xvzgl","hash":"39bb1a60598d86073f20a5c4fef56227326e5c3b9eb2ee3f82e57efd4ea1cd9b","amount":143.31427445756248}},{"node":{"id":"ckhtl0e7wbm630734ijl8qwpe","hash":"0af249fda6125f0584b2e52ba60ba357e61b5d2623b7e64637cfe6974d4361b2","amount":53.049970490416406}},{"node":{"id":"ckhtl0e7xbm640734fddx4f75","hash":"7e119236faecf155f3eea84a4ccb71a9901bc96fa4600a63d1f5edd4a8aab2cb","amount":20.05714181694738}},{"node":{"id":"ckhtkzyqrbm4x073473ectoy1","hash":"8b154845aa9e5247221e10955b7b28d420894f3698d0f03cefd8574c9d20fe6c","amount":246.71263198524676}},{"node":{"id":"ckhtkzyqsbm4y073478np9ium","hash":"e55406f36151b760da4c8a8850925988f2b2b36f118250ea6e8981ac510b5943","amount":24.872109014493844}},{"node":{"id":"ckhtkzr18bm4a07349iyrvebt","hash":"77b4aa0bfc544a430c9514e7613c0db81ae5c320b6fea8ca0f641cc41bd59b53","amount":78.60516911683392}},{"node":{"id":"ckhtkzr18bm4b0734nffm7o4r","hash":"73e4ab33f8f52319d380182a7d908f79d07ccafa6ba5354266ef21cbb096231a","amount":17.114481205439358}},{"node":{"id":"ckhtkzjc9bm3m0734ua6ndugy","hash":"c3d54c0195c6cc23e4b28eb315129eda11e7e0f4418ce00ea88fe8729811d281","amount":79.83884045196743}},{"node":{"id":"ckhtkzjc9bm3n0734ltjkrlub","hash":"85c9fa6e35f017d54a2b0b99acdeb8e2b7b043d89d604584e6d92e3b79435887","amount":37.339554694926555}}],"pageInfo":{"startCursor":"ckhtl0e7vbm6107346k1dihlk","endCursor":"ckhtkzjc9bm3n0734ltjkrlub"}}}}
   * Page last:
   *    Request: {"operationName":"TransactionsConnection","variables":{"last":10},"query":"query TransactionsConnection($where: TransactionWhereInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {\n  transactionsConnection(where: $where, orderBy: createdAt_DESC, skip: $skip, after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        id\n        hash\n        amount\n      }\n    }\n    pageInfo {\n      startCursor\n      endCursor\n    }\n  }\n}\n"}
   *    Response: {"data":{"transactionsConnection":{"edges":[{"node":{"id":"ckhs5wgqm7bt707342cjv1e1j","hash":"5c81a7465cfefd2a8e49738569f538a7db96ec96a1aeb48d14d31ae22dc4d4a9","amount":371.1841638422756}},{"node":{"id":"ckhs5w9147bsk0734ptov5xx1","hash":"20fc8faf3ea9c5938a1ef997093d6d6bd076c8415b606d13649b57951e19bc5f","amount":542.6066499758415}},{"node":{"id":"ckhs5w9157bsl0734uwxxjb7b","hash":"9a8f2e2e760f5e5db089e29a581d1873666593fd9dc5ef399584eb18fe65aeaa","amount":282.0185017751529}},{"node":{"id":"ckhs5w9157bsm073499l8atrd","hash":"426e264acd88315ae16840d472e0e13cc91eb381219ee1a714ce2a46a653c937","amount":515.6595332468582}},{"node":{"id":"ckhs5vtl97br80734se80da1p","hash":"c679a3494b5f87fe1aa20eb13ce52d961c276e6607aaecd43090351394e2c15c","amount":13.06851529668297}},{"node":{"id":"ckhs5vtl97br90734tyqid9ip","hash":"3e340c037fd4ffc218c01690038c84de72b46df8ff5975648c5b00df2572b348","amount":12.077574339739831}},{"node":{"id":"ckhs5vtla7bra0734d1ej4zv7","hash":"464e3dcee69f950c60d7ec9d020bdbc72d10fa4632561477ad6a41c057f494c2","amount":17.092103454538687}},{"node":{"id":"ckhs5vtla7brb0734gfx9vzfi","hash":"1881b6173b8416447b2df43fd7888b3ecb2c2081578b33ebaa704805a09db8ce","amount":677.2746236016314}},{"node":{"id":"ckhs5vltf7bqk0734hr45kk4r","hash":"476efc15d6452e38920f10efeb3fa40f91fdb1e005fd8731387c075cc2b64290","amount":136.23530925654927}},{"node":{"id":"ckhs5vltg7bql0734mpvqt2vi","hash":"3ab6f2d9249a5a3e80959a68788f071dfe4dc92dd379b998dc06527d61bd8e00","amount":191.79993427557855}}],"pageInfo":{"startCursor":"ckhs5wgqm7bt707342cjv1e1j","endCursor":"ckhs5vltg7bql0734mpvqt2vi"}}}}
   * Page last - 1:
   *    Request: {"operationName":"TransactionsConnection","variables":{"before":"ckhs5wgqm7bt707342cjv1e1j","last":10},"query":"query TransactionsConnection($where: TransactionWhereInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {\n  transactionsConnection(where: $where, orderBy: createdAt_DESC, skip: $skip, after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        id\n        hash\n        amount\n      }\n    }\n    pageInfo {\n      startCursor\n      endCursor\n    }\n  }\n}\n"}
   *    Response: {"data":{"transactionsConnection":{"edges":[{"node":{"id":"ckhs5xbka7bvy07347zjlugjq","hash":"3f8b7f0d18745197619731305a0f5cc44bcb0dd3a1ef00d4b8550cac7805ff2a","amount":527.6673860882369}},{"node":{"id":"ckhs5x3u67bv70734wsai4se9","hash":"3df3de3b7a568e2e75fa8fea1183a24fa58251c388280fe8bec092e5847d0447","amount":27.37318693373396}},{"node":{"id":"ckhs5x3u77bv80734cf21gsb2","hash":"86eeff9422fab7764a164579f72f8a2412a1fa8473325e2bd85054ad1159932d","amount":276.1578721354688}},{"node":{"id":"ckhs5x3u77bv907349xpzdjdh","hash":"dc551545de9c25d6b91ed4b5554c0a26d3b207e6f5f6c97ecb573e2e8f04fd0c","amount":351.85174161235955}},{"node":{"id":"ckhs5x3u87bva0734di0vmq75","hash":"8f79149407c3c98c19bfbf2bf34cdac689d2c381c6ae27342710caddcd00aa03","amount":97.49847453824451}},{"node":{"id":"ckhs5woga7btx0734qijx1ix2","hash":"6fadd881ddfbfc104d8bb41298bfabfdafc657e290068a9ce0bdea9763b57a47","amount":463.05629641068464}},{"node":{"id":"ckhs5woga7bty0734g0cbqoq3","hash":"8df8128325c6d1263944bdd61146f830a62f048447ccbbd9ed64ca10d4feed58","amount":294.69743429890127}},{"node":{"id":"ckhs5wogb7btz07343h159gko","hash":"0762526f139ca5f9975b1c4e5a567802f1a100626b79da1a9c4abcd00c97e5bc","amount":8.03133926862343}},{"node":{"id":"ckhs5wgql7bt50734a5v3nmfh","hash":"fe9f83bee11ba24c690e44de54578c3fdb670213b9e421ff85d55074a209c925","amount":69.77872908476007}},{"node":{"id":"ckhs5wgql7bt60734p9tdqqpw","hash":"2124a70301db2e56c68d2013981b5a33907c34832e3d74784ca0c0014efc8011","amount":77.37973723458715}}],"pageInfo":{"startCursor":"ckhs5xbka7bvy07347zjlugjq","endCursor":"ckhs5wgql7bt60734p9tdqqpw"}}}}
   */
  resolveQueryTransactionsConnection(where, orderBy, skip, after, before, first, last) {
    if (where != null && where.id_lte != null) {
      const count = this.getObjectIndex(where.id_lte) + 1;
      return {
        aggregate: {
          count: count
        }
      };
    }
    else
    {
      let transactions;
      if (first != null)
        transactions = this.getObjectsSeekForward(this.transactions, first, after);
      else if (last != null)
        transactions = this.getObjectsSeekBackward(this.transactions, last, before);
      else
        transactions = [];
      const edges = transactions.map((transaction) => {
        return {
          node: {
            id: transaction.id,
            hash: transaction.hash,
            amount: transaction.amount
          }
        };
      });
      return {
        pageInfo: {
          startCursor: edges[0].node.id,
          endCursor: edges[edges.length - 1].node.id
        },
        edges: edges
      };
    }
  }

  /**
   * Resolver for the transaction query.
   * @param {String} hash0x The transaction hash with '0x' prepended.
   * @return {Object} The resolved transaction object.
   * @public
   * 
   * queryTransaction Example:
   *    Request: {"operationName":"Transaction","variables":{"hash":"0xc786528bb0465092a81b2b127e135d4a45900aabcb881d3c61774d22430df332"},"query":"query Transaction($hash: String!) {\n  transaction(hash: $hash) {\n    id\n    hash\n    amount\n    block {\n      id\n      height\n    }\n  }\n}\n"}
   *    Response: {"data":{"transaction":{"id":"ckhus6mjyf8i40734rdbam37o","hash":"c786528bb0465092a81b2b127e135d4a45900aabcb881d3c61774d22430df332","amount":824.5956328101802,"block":{"id":"ckhus6mjuf8i10734snbglmuk","height":1258828}}}}
   */
  resolveQueryTransaction(hash0x) {
    const hash = this.getTransactionHash(hash0x);
    const transaction = this.transactionsMapByHash.get(hash);
    if (transaction === undefined)
      return null;
    else {
      return {
        id: transaction.id,
        hash: transaction.hash,
        amount: transaction.amount,
        block: {
          id: transaction.block.id,
          height: transaction.block.height
        }
      };
    }
  }

  /**
   * Resolver for the searchGetType query.
   * @param {String} query The search string.
   * @return {Object} The resolved SearchGetTypeResult object.
   * @public
   * 
   * querySearchGetType Example:
   * Query: "0x000d80c35eecf6e4bae648aa113a2c5533a097e5701ef124d389aea73b616592"
   *    Request: {"operationName":"SearchGetType","variables":{"query":"0x000d80c35eecf6e4bae648aa113a2c5533a097e5701ef124d389aea73b616592"},"query":"query SearchGetType($query: String!) {\n  searchGetType(query: $query) {\n    type\n  }\n}\n"}
   *    Response: {"data":{"searchGetType":{"type":"Transaction"}}}
   * Query: "1336993"
   *    Request: {"operationName":"SearchGetType","variables":{"query":"1336993"},"query":"query SearchGetType($query: String!) {\n  searchGetType(query: $query) {\n    type\n  }\n}\n"}
   *    Response: {"data":{"searchGetType":{"type":"Block"}}}
   */
  resolveQuerySearchGetType(query) {
    let type;
    if (query.startsWith('0x'))
      type = 'Transaction';
    else if (Number.isInteger(Number(query)))
      type = 'Block';
    else
      type = '';
    return {
      type: type
    };
  }

  /**
   * Resolver for the searchAutoComplete query.
   * @param {String} query The search string.
   * @param {Number} first The number of results to get.
   * @return {Object} The resolved SearchAutoCompleteResult object.
   * @public
   * 
   * querySearchAutoComplete Example:
   * Query: ""
   *    Request: {"operationName":"SearchAutoComplete","variables":{"query":"","first":6},"query":"query SearchAutoComplete($query: String!, $first: Int) {\n  searchAutoComplete(query: $query, first: $first) {\n    items\n  }\n}\n"}
   *    Response: {"data":{"searchAutoComplete":{"items":[]}}}
   * Query: "0"
   *    Request: {"operationName":"SearchAutoComplete","variables":{"query":"0","first":6},"query":"query SearchAutoComplete($query: String!, $first: Int) {\n  searchAutoComplete(query: $query, first: $first) {\n    items\n  }\n}\n"}
   *    Response: {"data":{"searchAutoComplete":{"items":[]}}}
   * Query: "0x"
   *    Request: {"operationName":"SearchAutoComplete","variables":{"query":"0x","first":6},"query":"query SearchAutoComplete($query: String!, $first: Int) {\n  searchAutoComplete(query: $query, first: $first) {\n    items\n  }\n}\n"}
   *    Response: {"data":{"searchAutoComplete":{"items":["0x000a839892f556e4f0b3a6f2de7266326da42130c8fa3517e912dc93331f0c74","0x000d80c35eecf6e4bae648aa113a2c5533a097e5701ef124d389aea73b616592","0x000f13e9d0c32b65170eb548032c2f2f7b7cea33f754ed936eab4c987299b3ed","0x001569d05611ba1e83bd372cc4f2abae0c18ff9353977fe30c19d683bdbf6b26","0x0016df075034e0a2b0712d6a8a66ccddb9602467a199b05b0fffe349d823775c","0x001a8261d14ef6656a09a99d169ba9c2fef89e66b09f277f9caa71bb64e5635d"]}}}
   * Query: "0x000d80c35eecf6e4bae648aa113a2c5533a097e5701ef124d389aea73b61659"
   *    Request: {"operationName":"SearchAutoComplete","variables":{"query":"0x000d80c35eecf6e4bae648aa113a2c5533a097e5701ef124d389aea73b61659","first":6},"query":"query SearchAutoComplete($query: String!, $first: Int) {\n  searchAutoComplete(query: $query, first: $first) {\n    items\n  }\n}\n"}
   *    Response: {"data":{"searchAutoComplete":{"items":["0x000d80c35eecf6e4bae648aa113a2c5533a097e5701ef124d389aea73b616592"]}}}
   * Query: "0x000d80c35eecf6e4bae648aa113a2c5533a097e5701ef124d389aea73b616592"
   *    Request: {"operationName":"SearchAutoComplete","variables":{"query":"0x000d80c35eecf6e4bae648aa113a2c5533a097e5701ef124d389aea73b616592","first":6},"query":"query SearchAutoComplete($query: String!, $first: Int) {\n  searchAutoComplete(query: $query, first: $first) {\n    items\n  }\n}\n"}
   *    Response: {"data":{"searchAutoComplete":{"items":["0x000d80c35eecf6e4bae648aa113a2c5533a097e5701ef124d389aea73b616592"]}}}
   * Query: "1"
   *    Request: {"operationName":"SearchAutoComplete","variables":{"query":"1","first":6},"query":"query SearchAutoComplete($query: String!, $first: Int) {\n  searchAutoComplete(query: $query, first: $first) {\n    items\n  }\n}\n"}
   *    Response: {"data":{"searchAutoComplete":{"items":[]}}}
   * Query: "13369"
   *    Request: {"operationName":"SearchAutoComplete","variables":{"query":"13369","first":6},"query":"query SearchAutoComplete($query: String!, $first: Int) {\n  searchAutoComplete(query: $query, first: $first) {\n    items\n  }\n}\n"}
   *    Response: {"data":{"searchAutoComplete":{"items":[]}}}
   * Query: "133699"
   *    Request: {"operationName":"SearchAutoComplete","variables":{"query":"133699","first":6},"query":"query SearchAutoComplete($query: String!, $first: Int) {\n  searchAutoComplete(query: $query, first: $first) {\n    items\n  }\n}\n"}
   *    Response: {"data":{"searchAutoComplete":{"items":["1336990","1336991","1336992","1336993","1336994","1336995"]}}}
   * Query: "1336993"
   *    Request: {"operationName":"SearchAutoComplete","variables":{"query":"1336993","first":6},"query":"query SearchAutoComplete($query: String!, $first: Int) {\n  searchAutoComplete(query: $query, first: $first) {\n    items\n  }\n}\n"}
   *    Response: {"data":{"searchAutoComplete":{"items":[]}}}
   */
  resolveQuerySearchAutoComplete(query, first) {
    let items;
    if (query.startsWith('0x')) {
      const hash = query.slice(2);
      items = this.transactions
        .filter(transaction => transaction.hash.startsWith(hash))
        .map(transaction => '0x' + transaction.hash)
        .slice(0, first);
    }
    else
    {
      const blockHeight = Number(query);
      if (blockHeight && Number.isInteger(blockHeight)) {
        items = this.blocks
          .filter(block => block.height.toString().startsWith(query))
          .map(block => block.height.toString())
          .slice(0, first);
      }
      else
        items = [];
    }
    return {
      items: items
    };
  }

  /**
   * Resolver for the dailyNetworkStatses query.
   * @param {Number} last The number of DailyNetworkStats objects to get in the backward direction.
   * @param {Number} skip The number of DailyNetworkStats objects to skip.
   * @param {Number} orderBy A DailyNetworkStatsOrderByInput value specifying the desired order of
   * DailyNetworkStats objects.
   * @return {Object} The resolved array of DailyNetworkStats objects.
   * @public
   * 
   * Note that orderBy is always date_ASC, and skip is not used.
   * queryNetworkStats Example:
   *    Request: {"operationName":"DailyNetworkStatses","variables":{"last":14},"query":"query DailyNetworkStatses($last: Int, $skip: Int) {\n  dailyNetworkStatses(last: $last, skip: $skip, orderBy: date_ASC) {\n    id\n    date\n    numBlocks\n    numTransactions\n  }\n}\n"}
   *    Response: {"data":{"dailyNetworkStatses":[{"id":"ckhicrc9mdnda07342der8p90","date":"2020-11-14T00:00:00.000Z","numBlocks":7098,"numTransactions":13937},{"id":"ckhjs7anthz3q0734m5vpj2lu","date":"2020-11-15T00:00:00.000Z","numBlocks":6986,"numTransactions":13982},{"id":"ckhl7n0dhmas30734v834pen7","date":"2020-11-16T00:00:00.000Z","numBlocks":6886,"numTransactions":13698},{"id":"ckhmn2yk9qmo70734lrn0czoi","date":"2020-11-17T00:00:00.000Z","numBlocks":608,"numTransactions":1202},{"id":"ckho2iqo4uy810734yumfkcuj","date":"2020-11-18T00:00:00.000Z","numBlocks":351,"numTransactions":711},{"id":"ckhphylhbz9w00734lfngx1wr","date":"2020-11-19T00:00:00.000Z","numBlocks":104,"numTransactions":220},{"id":"ckhqxeh833l3y0734vxpzpm53","date":"2020-11-20T00:00:00.000Z","numBlocks":8636,"numTransactions":17146},{"id":"ckhscub7r7wnq0734ee43w9mr","date":"2020-11-21T00:00:00.000Z","numBlocks":8460,"numTransactions":16885},{"id":"ckhtsa84bc83t0734j0x5crb5","date":"2020-11-22T00:00:00.000Z","numBlocks":8330,"numTransactions":16602},{"id":"ckhv7q13ugjgx0734lg942xmo","date":"2020-11-23T00:00:00.000Z","numBlocks":8139,"numTransactions":16183},{"id":"ckhwn5xh40h2b0782nprwsrvp","date":"2020-11-24T00:00:00.000Z","numBlocks":8027,"numTransactions":16193},{"id":"ckhy2ludk4tea07828veiu4us","date":"2020-11-25T00:00:00.000Z","numBlocks":7956,"numTransactions":15899},{"id":"ckhzi1pfc97sl0782at3omkxk","date":"2020-11-26T00:00:00.000Z","numBlocks":7852,"numTransactions":15679},{"id":"cki0xhhbodnas0782guskbl5k","date":"2020-11-27T00:00:00.000Z","numBlocks":8635,"numTransactions":17225}]}}
   */
  resolveQueryDailyNetworkStatses(last, skip, orderBy) {
    let dailyNetworkStatses = [];
    let dateToday = new Date();
    const blocksPerDay = 24 * 60 * 60 * 1000 / Constants.STATIC_BLOCK_TIME_MS;

    for (let i = last; i > 0; i--) {
      let date = new Date();
      date.setDate(dateToday.getDate() - i);
      const blocks = this.blocks.filter((block) => this.areDatesOnSameDay(block.timestamp, date));
      
      let numBlocks;
      let numTransactions;
      if (blocks.length < blocksPerDay) {
        // Blocks were not fully generated for this date, so simulate.
        numBlocks = blocksPerDay;
        numTransactions = this.getNumTransactions(date);
      }
      else {
        numBlocks = blocks.length;
        numTransactions =
          blocks.reduce((numTransactions, block) => numTransactions + block.transactions.length, 0);
      }

      dailyNetworkStatses.push({
        id: `DNS-${i}`,
        date: date.toUTCString(),
        numBlocks: numBlocks,
        numTransactions: numTransactions
      });
    }

    return dailyNetworkStatses;
  }

  /**
   * Resolver for the networkStats query.
   * @return {Object} The resolved NetworkStats object.
   * @public
   * 
   * queryNetworkStats Example:
   *    Request: {"operationName":null,"variables":{},"query":"{\n  networkStats {\n    id\n    secondsPerBlock\n    transactionsPerSecond\n  }\n}\n"}
   *    Response: {"data":{"networkStats":{"id":"cjw7b5tbz02xe0a14xictctei","secondsPerBlock":10.001101694915254,"transactionsPerSecond":0.18133595451348578}}}
   */
  resolveQueryNetworkStats() {
    const seconds = (this.blocks[this.blocks.length-1].timestamp - this.blocks[0].timestamp) / 1000;
    return {
      id: 'NS-0',
      secondsPerBlock: seconds / this.blocks.length,
      transactionsPerSecond: this.transactions.length / seconds
    }
  }

  /**
   * Resolver for the price query.
   * @return {Object} The resolved Price object.
   * @public
   * 
   * queryPrice Example:
   *    Request: {"operationName":null,"variables":{},"query":"{\n  price {\n    id\n    price\n  }\n}\n"}
   *    Response: {"data":{"price":{"id":"cjw7b5vth02xn0a14n3uhec0z","price":13.45263186}}}
   */
  resolveQueryPrice() {
    this.price = !this.price ?
      this.price = this.getPrice(new Date()) :                  // today's price
      this.price = this.price * getRandomNumber(0.999, 1.001);  // with minor fluctuations
    return {
      id: 'PR-0',
      price: this.price,
    }
  }

  /**
   * Resolver for the candles query.
   * @param {Date} start The starting date to get candles for.
   * @param {Date} end The ending date to get candles for.
   * @return {Array} The resolved array of OHLCVCandle objects.
   * @public
   * 
   * queryCandles Example:
   *    Request: {"operationName":"Candles","variables":{"start":"2020-11-16T18:12:23.095Z","end":"2020-11-30T18:12:23.096Z"},"query":"query Candles($start: DateTime!, $end: DateTime!) {\n  candles(start: $start, end: $end) {\n    timestamp\n    open\n    high\n    low\n    close\n    volume\n  }\n}\n"}
   *    Response: {"data":{"candles":[{"timestamp":"2020-11-17T00:00:00.000Z","open":14.60824323,"high":14.62298511,"low":14.33101394,"close":14.34198228,"volume":4653},{"timestamp":"2020-11-18T00:00:00.000Z","open":14.42896476,"high":14.59982701,"low":14.24846189,"close":14.58535171,"volume":4783},{"timestamp":"2020-11-19T00:00:00.000Z","open":13.90836574,"high":14.03365119,"low":13.66953519,"close":13.82917744,"volume":9360},{"timestamp":"2020-11-20T00:00:00.000Z","open":14.62516214,"high":14.91333725,"low":14.57331737,"close":14.82477908,"volume":3778},{"timestamp":"2020-11-21T00:00:00.000Z","open":15.56065579,"high":15.83803843,"low":15.50977978,"close":15.64444703,"volume":12031},{"timestamp":"2020-11-22T00:00:00.000Z","open":13.86207824,"high":13.93375996,"low":13.65978721,"close":13.93375996,"volume":3109},{"timestamp":"2020-11-23T00:00:00.000Z","open":16.18886079,"high":16.53832396,"low":15.81317068,"close":16.53689396,"volume":12869},{"timestamp":"2020-11-24T00:00:00.000Z","open":17.75516076,"high":17.92194074,"low":17.50324815,"close":17.84700421,"volume":12155},{"timestamp":"2020-11-25T00:00:00.000Z","open":16.90296738,"high":17.10854283,"low":16.77255958,"close":16.86642115,"volume":1586},{"timestamp":"2020-11-26T00:00:00.000Z","open":14.31033781,"high":14.36314762,"low":14.08411652,"close":14.27428707,"volume":1573},{"timestamp":"2020-11-27T00:00:00.000Z","open":15.06160607,"high":15.34320041,"low":15.04276631,"close":15.16815528,"volume":9432},{"timestamp":"2020-11-28T00:00:00.000Z","open":17.16938537,"high":17.18921938,"low":17.1599906,"close":17.18411013,"volume":867},{"timestamp":"2020-11-29T00:00:00.000Z","open":14.37013374,"high":14.62334475,"low":14.33989736,"close":14.61807672,"volume":3975},{"timestamp":"2020-11-30T00:00:00.000Z","open":16.67891746,"high":16.81697609,"low":16.49109941,"close":16.49109941,"volume":1932}]}}
   */
  resolveQueryCandles(start, end) {
    let candles = [];
    const dateStart = new Date(start);
    // Match Nomics behavior of returning the first day after the start date.
    dateStart.setDate(dateStart.getDate() + 1);
    const dateEnd = new Date(end);
    for (let date = dateStart; date <= dateEnd; date.setDate(date.getDate() + 1))
    {
      const price = this.getPrice(date);
      // Only timestamp and close are used.
      candles.push({
        timestamp: date.toUTCString(),
        open: 0,
        high: 0,
        low: 0,
        close: price,
        volume: 0
      });
    }
    return candles;
  }

  /**
   * Add a new block.
   * @param {Date} date The date the block was created.
   * @private
   */
  addBlock(date) {
    const block = {
      id: this.getBlockId(this.blocks.length),
      height: this.blockHeight++,
      timestamp: date,
      transactions: []
    };

    const numTransactions = getRandomInt(
      Constants.STATIC_TXS_PER_BLOCK_MIN, Constants.STATIC_TXS_PER_BLOCK_MAX);
    for (let i = 0; i < numTransactions; i++) {
      block.transactions.push(this.createTransaction(block));
    }

    this.blocks.push(block);
    this.blocksMapByHeight.set(block.height, block);
  }

  /**
   * Determine whether the two specified dates are on the same day (e.g., December 25, 2020).
   * @param {Date} first The first date.
   * @param {Date} second The second date.
   * @return {Boolean} True if the two specified dates are on the same day, false otherwise.
   * @private
   */
  areDatesOnSameDay(first, second) {
    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  }

  /**
   * Create a new transaction object for the specified block.
   * @param {Object} block The block object to add the transaction to.
   * @return {Object} The created transaction object.
   * @private
   */
  createTransaction(block) {
    const hash = sha3_256(getRandomInt(0, Number.MAX_SAFE_INTEGER).toString());
    const amount = getRandomNumber(1, getRandomNumber(0, 1) > 0.5 ? 1000 : 100);
    const transaction = {
      id: this.getTransactionId(this.transactions.length),
      hash: hash,
      amount: amount,
      block: block
    };
    this.transactions.push(transaction);
    this.transactionsMapByHash.set(transaction.hash, transaction);
    return transaction;
  }

  /**
   * Get the block ID corresponding to the specified block index.
   * @param {Number} blockIndex The index of the block to get the block ID for.
   * @return {String} The block ID corresponding to the specified block index.
   * @private
   */
  getBlockId(blockIndex) {
    return `BL-${blockIndex}`;
  }

  /**
   * Get the day of the year (1 - 366) of the specified date.
   * @param {Date} date The date to get the day of the year of.
   * @return {Number} The day of the year (1 - 366) of the specified date.
   * @private
   */
  getDayOfYear(date) {
    return (
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0))
      / 24 / 60 / 60 / 1000;
  }

  /**
   * Get the number of transactions for the specified date.
   * @param {Date} date The date to get the number of transactions for.
   * @return {Number} The number of transactions for the specified date.
   * @private
   */
  getNumTransactions(date) {
    // Use modulus operator on days of year to get index into transactionsPerDays[] array.
    return this.transactionsPerDays[this.getDayOfYear(date) % this.transactionsPerDays.length]
  }

  /**
   * Get the block or transaction index corresponding to the specified block or transaction ID.
   * @param {String} id The ID of the block or transaction to get the index for.
   * @return {Number} The block or transaction index corresponding to the specified block or
   * transaction ID.
   * @private
   */
  getObjectIndex(id) {
    return parseInt(id.split('-').pop(), 10);
  }

  /**
   * Get the array of block or transaction objects corresponding to the specified seek-backward
   * pagination parameters.
   * @param {Object} array The array of all block or transaction objects.
   * @param {Number} last The number of block or transaction objects to get in the backward
   * direction.
   * @param {String} before Get the block or transaction objects before the object with this ID.
   * @return {Object} The array of block or transaction objects corresponding to the specified
   * seek-backward pagination parameters.
   * @private
   */
  getObjectsSeekBackward(array, last, before) {
    // Note that the blocks and transactions arrays are ordered oldest to newest (i.e., ascending
    // order), but all GraphQL queries use descending order (i.e., height_DESC, createdAt_DESC).
    const start = before != null ? this.getObjectIndex(before) + 1 : 0;
    // If start is past the last object, return an empty array, since there are no objects before
    // the last object.
    if (start === array.length)
      return [];
    const end = Math.min(start + last, array.length);
    return array.slice(start, end).reverse();
  }

  /**
   * Get the array of block or transaction objects corresponding to the specified seek-forward
   * pagination parameters.
   * @param {Object} array The array of all block or transaction objects.
   * @param {Number} first The number of block or transaction objects to get in the forward
   * direction.
   * @param {String} after Get the block or transaction objects after the object with this ID.
   * @return {Object} The array of block or transaction objects corresponding to the specified
   * seek-forward pagination parameters.
   * @private
   */
  getObjectsSeekForward(array, first, after) {
    // Note that the blocks and transactions arrays are ordered oldest to newest (i.e., ascending
    // order), but all GraphQL queries use descending order (i.e., height_DESC, createdAt_DESC).
    const end = after != null ? this.getObjectIndex(after) : array.length;
    // If end is the first object, return an empty array, since there are no objects after the first
    // object.
    if (end === 0)
      return [];
    const start = Math.max(end - first, 0);
    return array.slice(start, end).reverse();
  }

  /**
   * Get the price for the specified date.
   * @param {Date} date The date to get the price for.
   * @return {Number} The price for the specified date.
   * @private
   */
  getPrice(date) {
      // Use modulus operator on day of year to get index into prices[] array.
      return this.prices[this.getDayOfYear(date) % this.prices.length];
  }

  /**
   * Get the transaction hash corresponding to the specified '0x'-prepended transaction hash.
   * @param {String} hash0x The transaction hash with '0x' prepended.
   * @return {String} The transaction hash with '0x' removed.
   * @private
   */
  getTransactionHash(hash0x) {
    return hash0x.startsWith('0x') ? hash0x.slice(2) : hash0x;
  }

  /**
   * Get the transaction ID corresponding to the specified transaction index.
   * @param {Number} transactionIndex The index of the transaction to get the transaction ID for.
   * @return {String} The transaction ID corresponding to the specified transaction index.
   * @private
   */
  getTransactionId(transactionIndex) {
    return `TX-${transactionIndex}`;
  }
}

export default MockServer;
