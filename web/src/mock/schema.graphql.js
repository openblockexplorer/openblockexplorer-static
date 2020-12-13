/**
 * @file schema.graphql.js
 * @copyright Copyright (c) 2018-2020 Dylan Miller and openblockexplorer contributors
 * @license MIT License
 */

import gql from 'graphql-tag';

const schemaTypeDefs = gql`
  type Query {
    blocks(first: Int, orderBy: BlockOrderByInput): [Block!]!
    blocksConnection(
      where: BlockWhereInput, orderBy: BlockOrderByInput, skip: Int, after: String, before: String,
      first: Int, last: Int): BlockConnection!
    block(height: Int!): Block
    transactions(first: Int, orderBy: TransactionOrderByInput): [Transaction!]!
    transactionsConnection(
      where: TransactionWhereInput, orderBy: TransactionOrderByInput, skip: Int, after: String,
      before: String, first: Int, last: Int): TransactionConnection!
    transaction(hash: String!): Transaction
    searchGetType(query: String!): SearchGetTypeResult!
    searchAutoComplete(query: String!, first: Int): SearchAutoCompleteResult!
    dailyNetworkStatses(last: Int, skip: Int, orderBy: DailyNetworkStatsOrderByInput): [DailyNetworkStats]!
    networkStats: NetworkStats!
    price: Price!
    candles(start: DateTime!, end: DateTime!) : [OHLCVCandle!]!
  }

  type Subscription {
    block: BlockSubscriptionPayload
    transaction: TransactionSubscriptionPayload
    networkStats: NetworkStatsSubscriptionPayload
    price: PriceSubscriptionPayload
  }

  interface Node {
    id: ID!
  }

  type Block implements Node {
    id: ID!
    height: Int!
    timestamp: DateTime!
    transactions: [Transaction!]!
    numTransactions: Int!
  }

  type Transaction implements Node {
    id: ID!
    hash: String!
    amount: Float!
    block: Block!
  }

  type DailyNetworkStats implements Node {
    id: ID!
    date: DateTime!
    numBlocks: Int!
    numTransactions: Int!
  }

  type NetworkStats implements Node {
    id: ID!
    secondsPerBlock: Float!
    transactionsPerSecond: Float!
  }

  type Price implements Node {
    id: ID!
    price: Float!
  }

  type OHLCVCandle {
    timestamp: DateTime!
    open: Float!
    high: Float!
    low: Float!
    close: Float!
    volume: Float!
  }

  type SearchGetTypeResult {
    type: String!
  }

  type SearchAutoCompleteResult {
    items: [String!]!
  }                
`;

export default schemaTypeDefs;
