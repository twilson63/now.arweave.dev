import { AddPair, CreateOrder, CancelOrder, ReadOutbox, Halt } from '@verto/flex'

export async function handle(state, action) {
  const input = action.input

  if (input.function === 'evolve') {
    if (state.canEvolve) {
      if (state.creator === action.caller) {
        state.evolve = input.value
      }
    }
  }

  if (input.function === 'transfer') {
    const balances = state.balances;
    const caller = action.caller;

    const target = input.target;
    const quantity = input.qty;

    if (!Number.isInteger(quantity) || quantity === undefined) {
      throw new ContractError(
        "Invalid value for quantity. Must be an integer."
      );
    }
    if (!target) {
      throw new ContractError("No target specified.");
    }
    if (quantity <= 0 || caller === target) {
      throw new ContractError("Invalid token transfer.");
    }
    if (balances[caller] < quantity) {
      throw new ContractError(
        "Caller balance not high enough to send " + quantity + " token(s)."
      );
    }

    balances[caller] -= quantity;
    if (target in balances) {
      balances[target] += quantity;
    } else {
      balances[target] = quantity;
    }

    return { state };
  }

  if (input.function === 'balance') {
    const balances = state.balances
    const caller = action.caller

    let target

    if (!input.target) {
      target = caller
    } else {
      target = input.target
    }

    const ticker = state.ticker;

    if (typeof target !== "string") {
      throw new ContractError("Must specify target to get balance")
    }

    if (typeof balances[target] !== "number") {
      throw new ContractError("Cannot get balance; target does not exist.")
    }

    return {
      result: {
        target,
        ticker,
        balance: balances[target]
      }
    }
  }
  // @verto/flex wrappers
  if (input.function === 'addPair') {
    const s = await AddPair(state, action)
    return { state: s }
  }

  if (input.function === 'createOrder') {
    const s = await CreateOrder(state, action)
    return s
  }

  if (input.function === 'cancelOrder') {
    const s = await CancelOrder(state, action)
    return { state: s }
  }

  if (input.function === 'halt') {
    const s = await Halt(state, action)
    return { state: s }
  }

  if (input.function === 'readOutbox') {
    const s = await ReadOutbox(state, action)
    return { state: s }
  }
}