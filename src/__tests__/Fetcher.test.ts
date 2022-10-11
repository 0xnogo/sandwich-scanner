import axios from 'axios';
import { BigNumber } from 'ethers';
import { Fetcher } from '../Fetcher';
import type { Swap } from '../interfaces/Swap';
import { ProviderWrapper } from '../ProviderWrapper';

jest.mock("../ProviderWrapper");

jest.mock("axios");

const providerWrapperMockFactory = jest.mocked(ProviderWrapper);

const dummyLog = {
  blockNumber: 1,
  blockHash: "DUMMY_BLOCK_HASH",
  transactionIndex: 1,
  removed: false,
  address: "DUMMY_ADDRESS",
  data: "DUMMY_DATA",
  topics: [],
  transactionHash: "DUMMY_TX_HASH",
  logIndex: 1
}

describe('Fetcher', () => {
  let fetcher: Fetcher;
  const providerWrapperMockInstance = providerWrapperMockFactory.prototype;

  beforeEach(() => {
    fetcher = new Fetcher(providerWrapperMockInstance, "DUMMY_COVALENT_KEY");
  });

  afterEach(() => {  
    jest.clearAllMocks();
  });

  it('should get transaction details', async () => {
    // GIVEN
    providerWrapperMockInstance.callProviderWithRetriesAndWait = jest.fn()
      .mockResolvedValueOnce({
        transactionIndex: 1,
        blockNumber: 1,
        logs: [dummyLog]
      })
      .mockResolvedValueOnce({
        transactionIndex: 2,
        blockNumber: 2,
        logs: []
      });

    // WHEN
    const result1 = await fetcher.getTransactionDetails("DUMMY_TX_HASH");
    const result2 = await fetcher.getTransactionDetails("DUMMY_TX_HASH");

    // THEN
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1?.blockNumber).toBe(1);
    expect(result2?.blockNumber).toBe(2);
    expect(providerWrapperMockInstance.callProviderWithRetriesAndWait).toHaveBeenCalledTimes(2);
  });

  it('should get transaction details by block number and index', async () => {
    // GIVEN
    providerWrapperMockInstance.callProviderWithRetries = jest.fn()
      .mockResolvedValueOnce("DUMMY_HASH");

    providerWrapperMockInstance.callProviderWithRetriesAndWait = jest.fn()
      .mockResolvedValueOnce({
        transactionIndex: 1,
        blockNumber: 1,
        logs: [dummyLog]
      });

    // WHEN
    const result = await fetcher.getTransactionDetailsByBlockNumberAndIndex(1, 1);

    // THEN
    expect(result).toBeDefined();
    expect(result?.blockNumber).toBe(1);
    expect(providerWrapperMockInstance.callProviderWithRetries).toHaveBeenCalledTimes(1);
    expect(providerWrapperMockInstance.callProviderWithRetriesAndWait).toHaveBeenCalledTimes(1);
  });

  it('should get transaction details from address', async () => {
    // GIVEN
    const items: {tx_hash: string}[] = [
      {
        tx_hash: "DUMMY_TX_HASH_1",
      },
      {
        tx_hash: "DUMMY_TX_HASH_2",
      },
    ]

    axios.get = jest.fn()
      .mockResolvedValueOnce({data: {data: {items: items, pagination: {has_more: false}}}});

    providerWrapperMockInstance.callProviderWithRetriesAndWait = jest.fn()
      .mockResolvedValueOnce({
        transactionIndex: 1,
        blockNumber: 1,
        logs: [dummyLog]
      })
      .mockResolvedValueOnce({
        transactionIndex: 2,
        blockNumber: 2,
        logs: [dummyLog]
      });

    // WHEN
    const result = await fetcher.getTransactionDetailsFromAddress("DUMMY_ADDRESS");
    
    // THEN
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result[0]?.hash).toBe(items[0]?.tx_hash);
    expect(result[1]?.hash).toBe(items[1]?.tx_hash);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(providerWrapperMockInstance.callProviderWithRetriesAndWait).toHaveBeenCalledTimes(2);
  });

  it('should get all transactions from address', async () => {
    // GIVEN
    const items: {tx_hash: string}[] = [
      {
        tx_hash: "DUMMY_TX_HASH_1",
      },
      {
        tx_hash: "DUMMY_TX_HASH_2",
      },
    ]

    axios.get = jest.fn()
      .mockResolvedValueOnce({data: {data: {items: items, pagination: {has_more: false}}}});

    // WHEN
    const result = await fetcher.getAllTxFromAddress("DUMMY_ADDRESS");
    
    // THEN
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(items[0]?.tx_hash);
    expect(result[1]).toEqual(items[1]?.tx_hash);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('should get all transactions details from block', async () => {
    // GIVEN
    const block = {transactions: ["DUMMY_TX_HASH_1", "DUMMY_TX_HASH_2"]};
    providerWrapperMockInstance.callProviderWithRetriesAndWait = jest.fn()
      .mockResolvedValueOnce(block)
      .mockResolvedValueOnce({
        transactionIndex: 1,
        blockNumber: 1,
        logs: [dummyLog]
      })
      .mockResolvedValueOnce({
        transactionIndex: 2,
        blockNumber: 1,
        logs: [dummyLog]
      });

    // WHEN
    const result = await fetcher.getAllTransactionDetailsFromBlock(1);
    
    // THEN
    expect(result).toBeDefined();
    expect(result[0]?.hash).toEqual(block["transactions"][0]);
    expect(result[1]?.hash).toEqual(block["transactions"][1]);
    expect(providerWrapperMockInstance.callProviderWithRetriesAndWait).toHaveBeenCalledTimes(3);
  });

  it('should get transaction details with offset', async () => {
    // GIVEN
    const swaps: Swap[] = [{
      txHash: 'DUMMY_HASH',
      txPosition: 5,
      blockNumber: 1,
      contractAddress: '0xD65E975c7D0d5871EfF8b079120E43C9F377aDa1',
      fromAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
      toAddress: '0x49fCf8f63764C0D5ea6697cADB6F9Bfc7fe44196',
      tokenInAddress: '0xAE1eaAE3F627AAca434127644371b67B18444051',
      tokenOutAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      amountIn: BigNumber.from('1000000000000000000'),
      amountOut: BigNumber.from('1000000000000000000'),
    },
    {
      txHash: 'DUMMY_HASH',
      txPosition: 2,
      blockNumber: 2,
      contractAddress: '0xD65E975c7D0d5871EfF8b079120E43C9F377aDa1',
      fromAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      toAddress: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
      tokenInAddress: '0xAE1eaAE3F627AAca434127644371b67B18444051',
      tokenOutAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      amountIn: BigNumber.from('1000000000000000000'),
      amountOut: BigNumber.from('1000000000000000000'),
    }]

    providerWrapperMockInstance.callProviderWithRetries = jest.fn()
      .mockResolvedValue({
        hash: 'DUMMY_HASH',
      });

    providerWrapperMockInstance.callProviderWithRetriesAndWait = jest.fn()
      .mockResolvedValueOnce({
        transactionIndex: 4,
        blockNumber: 1,
        logs: [],
      })
      .mockResolvedValueOnce({
        transactionIndex: 1,
        blockNumber: 2,
        logs: [],
      })
      .mockResolvedValueOnce({
        transactionIndex: 6,
        blockNumber: 1,
        logs: [],
      })
      .mockResolvedValueOnce({
        transactionIndex: 3,
        blockNumber: 2,
        logs: [],
      });

    // WHEN
    const result = await fetcher.getTransactionsDetailsWithOffset(swaps, 1);
    
    // THEN
    expect(result).toBeDefined();
    expect(result.get(swaps[0]!)).toHaveLength(2);
    expect(result.get(swaps[1]!)).toHaveLength(2);
    expect(providerWrapperMockInstance.callProviderWithRetriesAndWait).toHaveBeenCalledTimes(4);
    expect(providerWrapperMockInstance.callProviderWithRetries).toHaveBeenCalledTimes(4);
  });
})