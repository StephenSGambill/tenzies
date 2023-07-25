import './App.css';
import { Die } from './components/Die';
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';


export default function App() {
  const [dice, setDice] = useState(AllNewDice())
  const [tenzies, setTenzies] = useState(false)


  useEffect(() => {
    if (checkHolds() && checkNumbers()) {
      setTenzies(true)
    }
  }, [dice])



  function checkNumbers() {
    const firstNumber = dice[0]?.value;
    return dice.every(die => die.value === firstNumber);
  }

  function checkHolds() {
    const totalHolds = dice.filter(die => die.isHeld).length;
    return totalHolds === dice.length;
  }


  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false
    }
  }

  function AllNewDice() {
    const allDice = []
    for (let i = 0; i < 10; i++) {
      allDice.push(generateNewDie())
    }
    return allDice
  }


  function rollDice() {
    if (!tenzies) {
      setDice(oldDice => {
        return oldDice.map(die => {
          return die.isHeld ?
            die
            : generateNewDie()
        })
      })
    } else {
      setTenzies(false)
      setDice(AllNewDice)

    }

  }

  function holdDice(id) {
    setDice(oldDice =>
      oldDice.map(die => {
        return die.id === id ?
          { ...die, isHeld: !die.isHeld }
          : die
      })
    )
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      id={die.id}
      holdDice={() => holdDice(die.id)} />
  ))


  return (
    <main className="container">

      <h1>Tenzies</h1>
      <p>Roll until dice are the same. Click each die to freeze it at its current value between rolls.</p>

      <div className="die-container">
        {diceElements
        }

      </div>
      <button
        onClick={rollDice}
        className='roll-btn'
      >{tenzies ? "New Game" : "Roll"}
      </button>
      {tenzies && <Confetti />}
    </main >
  )
}
