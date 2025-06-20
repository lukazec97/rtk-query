import React from "react";
import { Greeting } from "./Greeting";
import UserProfile from "./UserProfile";
import { useCounter } from "../hooks/useCounter";

const Counter = () => {
  const {count, increment} = useCounter();

  return (
    <div>
      <p data-testid="counter-value">Counter: {count}</p>
      <button onClick={increment}>Increment</button>
      <Greeting />
      <UserProfile userId={4}/>
    </div>
  );
};

export default Counter;
