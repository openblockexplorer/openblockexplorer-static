/**
 * @file prisma.graphql.js
 * @copyright Copyright (c) 2018-2020 Dylan Miller and openblockexplorer contributors
 * @license MIT License
 */

import gql from 'graphql-tag';

const prismaTypeDefs = gql`
  type AggregateBlock {
    count: Int!
  }

  type AggregateTransaction {
    count: Int!
  }

  type BlockConnection {
    pageInfo: PageInfo!
    edges: [BlockEdge]!
    aggregate: AggregateBlock!
  }

  type BlockEdge {
    node: Block!
    cursor: String!
  }

  enum BlockOrderByInput {
    id_ASC
    id_DESC
    createdAt_ASC
    createdAt_DESC
    height_ASC
    height_DESC
    timestamp_ASC
    timestamp_DESC
  }

  type BlockPreviousValues {
    id: ID!
    createdAt: DateTime!
    height: Int!
    timestamp: DateTime!
  }

  type BlockSubscriptionPayload {
    mutation: MutationType!
    node: Block
    updatedFields: [String!]
    previousValues: BlockPreviousValues
  }

  input BlockWhereInput {
    id: ID
    id_not: ID
    id_in: [ID!]
    id_not_in: [ID!]
    id_lt: ID
    id_lte: ID
    id_gt: ID
    id_gte: ID
    id_contains: ID
    id_not_contains: ID
    id_starts_with: ID
    id_not_starts_with: ID
    id_ends_with: ID
    id_not_ends_with: ID
    createdAt: DateTime
    createdAt_not: DateTime
    createdAt_in: [DateTime!]
    createdAt_not_in: [DateTime!]
    createdAt_lt: DateTime
    createdAt_lte: DateTime
    createdAt_gt: DateTime
    createdAt_gte: DateTime
    height: Int
    height_not: Int
    height_in: [Int!]
    height_not_in: [Int!]
    height_lt: Int
    height_lte: Int
    height_gt: Int
    height_gte: Int
    timestamp: DateTime
    timestamp_not: DateTime
    timestamp_in: [DateTime!]
    timestamp_not_in: [DateTime!]
    timestamp_lt: DateTime
    timestamp_lte: DateTime
    timestamp_gt: DateTime
    timestamp_gte: DateTime
    transactions_every: TransactionWhereInput
    transactions_some: TransactionWhereInput
    transactions_none: TransactionWhereInput
    AND: [BlockWhereInput!]
    OR: [BlockWhereInput!]
    NOT: [BlockWhereInput!]
  }

  enum Currency {
    DFN
  }

  enum DailyNetworkStatsOrderByInput {
    id_ASC
    id_DESC
    date_ASC
    date_DESC
    numBlocks_ASC
    numBlocks_DESC
    numTransactions_ASC
    numTransactions_DESC
  }

  scalar DateTime

  enum Duration {
    MINUTES_10
  }

  enum MutationType {
    CREATED
    UPDATED
    DELETED
  }

  type NetworkStatsPreviousValues {
    id: ID!
    duration: Duration!
    secondsPerBlock: Float!
    transactionsPerSecond: Float!
  }

  type NetworkStatsSubscriptionPayload {
    mutation: MutationType!
    node: NetworkStats
    updatedFields: [String!]
    previousValues: NetworkStatsPreviousValues
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type PricePreviousValues {
    id: ID!
    currency: Currency!
    price: Float!
  }

  type PriceSubscriptionPayload {
    mutation: MutationType!
    node: Price
    updatedFields: [String!]
    previousValues: PricePreviousValues
  }

  type TransactionConnection {
    pageInfo: PageInfo!
    edges: [TransactionEdge]!
    aggregate: AggregateTransaction!
  }

  type TransactionEdge {
    node: Transaction!
    cursor: String!
  }

  enum TransactionOrderByInput {
    id_ASC
    id_DESC
    createdAt_ASC
    createdAt_DESC
    hash_ASC
    hash_DESC
    amount_ASC
    amount_DESC
  }

  type TransactionPreviousValues {
    id: ID!
    createdAt: DateTime!
    hash: String!
    amount: Float!
  }

  type TransactionSubscriptionPayload {
    mutation: MutationType!
    node: Transaction
    updatedFields: [String!]
    previousValues: TransactionPreviousValues
  }

  input TransactionWhereInput {
    id: ID
    id_not: ID
    id_in: [ID!]
    id_not_in: [ID!]
    id_lt: ID
    id_lte: ID
    id_gt: ID
    id_gte: ID
    id_contains: ID
    id_not_contains: ID
    id_starts_with: ID
    id_not_starts_with: ID
    id_ends_with: ID
    id_not_ends_with: ID
    createdAt: DateTime
    createdAt_not: DateTime
    createdAt_in: [DateTime!]
    createdAt_not_in: [DateTime!]
    createdAt_lt: DateTime
    createdAt_lte: DateTime
    createdAt_gt: DateTime
    createdAt_gte: DateTime
    hash: String
    hash_not: String
    hash_in: [String!]
    hash_not_in: [String!]
    hash_lt: String
    hash_lte: String
    hash_gt: String
    hash_gte: String
    hash_contains: String
    hash_not_contains: String
    hash_starts_with: String
    hash_not_starts_with: String
    hash_ends_with: String
    hash_not_ends_with: String
    amount: Float
    amount_not: Float
    amount_in: [Float!]
    amount_not_in: [Float!]
    amount_lt: Float
    amount_lte: Float
    amount_gt: Float
    amount_gte: Float
    block: BlockWhereInput
    AND: [TransactionWhereInput!]
    OR: [TransactionWhereInput!]
    NOT: [TransactionWhereInput!]
  }
`;

export default prismaTypeDefs;
