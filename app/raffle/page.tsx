'use client'
import { entries } from '@/entries'
import React, { useCallback, useEffect, useState } from 'react'
// import { entries3 as entries } from './entries'

interface Winner {
  name: string
  address?: string
}

const inVisibleNames = [
  { name: 'Raffle', address: '' },
  { name: 'Raffle', address: '' },
  { name: 'Raffle', address: '' },
  { name: 'Raffle', address: '' },
  { name: 'Raffle', address: '' },
  { name: 'Raffle', address: '' },
  { name: 'Raffle', address: '' }
]

const participants = entries

const RaffleApp: React.FC = () => {
  const [shuffling, setShuffling] = useState(false)
  const [pauseShuffling, setPauseShuffling] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [showRaffleContainer, setShowRaffleContainer] = useState(false)
  const [viewAllWinners, setViewAllWinners] = useState(false)
  const [currentWinner, setCurrentWinner] = useState<Winner | null>(null)
  const [winners, setWinners] = useState<Winner[]>([])
  const [currentWinners, setCurrentWinners] = useState<Winner[]>([])
  const [visibleNames, setVisibleNames] = useState<Winner[]>(inVisibleNames)
  const [numWinners, setNumWinners] = useState(1)
  const [showName, setShowName] = useState(false)
  // const [rafflePassword, setRafflePassword] = useState('')
  // const [division, setDivision] = useState('')
  console.log(showName)

  const startShuffling = () => {
    // if (rafflePassword !== '1522' || division === '') {
    //   return null
    // }

    setShowRaffleContainer(true)

    // Clear the winners list when the Spin button is clicked
    setCurrentWinners([])
    setStopped(false)
    setShowName(false)
    setPauseShuffling(false)
    setCurrentWinner(null)

    setTimeout(() => {
      setShuffling(true)
    }, 1000)
  }

  // Set up the effect to show name after 2 seconds
  useEffect(() => {
    if (currentWinner) {
      const timer = setTimeout(() => {
        setShowName(true) // Show name after 2 seconds
      }, 3000) // 2 seconds delay

      // Clean up the timer when currentWinner changes
      return () => clearTimeout(timer)
    }
  }, [currentWinner])

  // Load winners from localStorage if available
  useEffect(() => {
    const savedWinners = localStorage.getItem('winners')
    if (savedWinners) {
      setWinners(JSON.parse(savedWinners))
    }
  }, [])

  useEffect(() => {
    if (shuffling && !pauseShuffling) {
      const interval = setInterval(() => {
        setVisibleNames(() => {
          const randomNames = []
          for (let i = 0; i < 7; i++) {
            const randomIndex = Math.floor(Math.random() * participants.length)
            randomNames.push(participants[randomIndex])
          }
          return randomNames
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [shuffling, pauseShuffling])

  // Use a callback to ensure that we have the latest state when filtering participants
  const selectWinner = useCallback(() => {
    // Filter out winners that have already been selected
    const remainingParticipants = participants.filter(
      (p) => !winners.some((w) => w.name === p.name)
    )

    if (remainingParticipants.length === 0) {
      return null
    }

    const randomIndex = Math.floor(Math.random() * remainingParticipants.length)
    return remainingParticipants[randomIndex]
  }, [winners])

  useEffect(() => {
    if (shuffling) {
      const options = numWinners > 1 ? [7000, 9000] : [9000, 11000]
      const interVal = options[Math.floor(Math.random() * options.length)]
      const winnerInterval = setInterval(() => {
        const uniqueWinner = selectWinner()

        if (!uniqueWinner) {
          clearInterval(winnerInterval)
          return
        }

        setCurrentWinner(uniqueWinner)
        setPauseShuffling(true)

        // Remove winner from the list of visible names
        setVisibleNames((prevNames) =>
          prevNames.filter((person) => person.name !== uniqueWinner.name)
        )

        // Update the winners list
        setWinners((prevWinners) => {
          const updatedWinners = [...prevWinners, uniqueWinner]
          localStorage.setItem('winners', JSON.stringify(updatedWinners))
          return updatedWinners
        })

        // Stop shuffling immediately if all winners have been selected
        if (currentWinners.length + 1 >= numWinners) {
          setShuffling(false)
          setPauseShuffling(true)
          clearInterval(winnerInterval)
          // Pause for 2.5 second to display the winner, then resume shuffling
          setTimeout(() => {
            // Update the winners list
            setCurrentWinners([...currentWinners, uniqueWinner])
          }, 3000) // Adjust timing if needed
        } else {
          // Pause for 2.5 second to display the winner, then resume shuffling
          setTimeout(() => {
            setPauseShuffling(false)
            setShowName(false)
            // Update the winners list
            setCurrentWinners([...currentWinners, uniqueWinner])
          }, 6000) // Adjust timing if needed
        }

        // Stop after all winners are selected
        if (currentWinners.length + 1 >= numWinners) {
          setShuffling(false)
          setPauseShuffling(true)
          return () => clearInterval(winnerInterval)
        }
      }, interVal)

      return () => clearInterval(winnerInterval)
    }
  }, [shuffling, winners, numWinners, selectWinner, currentWinners])

  const handleStop = () => {
    setCurrentWinners([])
    setVisibleNames(inVisibleNames)
    setShuffling(false)
    setStopped(true)
    setShowRaffleContainer(false)
  }

  return (
    <div className="bg-[url('/banner.jpeg')] bg-cover bg-top bg-no-repeat h-screen">
      <div className="flex flex-col items-center pt-20">
        <div className="pb-10 flex flex-col items-center w-[850px] bg-black bg-opacity-80 rounded-xl">
          <div className="pt-4 rounded-full relative h-full w-11/12 overflow-hidden">
            <div
              className={`names-container flex flex-col items-center transition-transform duration-2000 ease-in-out ${
                pauseShuffling ? 'pause' : 'animate-rolling'
              }`}
            >
              {visibleNames.map((person, index) => (
                <div
                  key={index}
                  className={`relative flex items-center justify-center uppercase px-2 space-x-4 text-center text-nowrap rounded-full ${
                    index === 3
                      ? `text-3xl my-1 py-2 w-full font-bold ${
                          pauseShuffling || currentWinners.length >= numWinners
                            ? 'text-gray-800 bg-gradient-to-b from-blue-300 to-white'
                            : 'bg-gradient-to-b from-blue-300 to-blue-500 text-white'
                        }` // Center name
                      : index === 2 || index === 4
                      ? 'bg-gradient-to-b from-blue-900 to-blue-500 text-white text-xl my-1 py-1 w-10/12' // Adjacent names
                      : index === 1 || index === 5
                      ? 'bg-gradient-to-b from-blue-900 to-blue-700 text-gray-300 w-3/5 text-sm py-px my-px' // Second row from center
                      : 'bg-gradient-to-b from-blue-900 to-blue-700 text-gray-300 w-2/5 text-xs py-px my-px' // Outer names
                  }`}
                >
                  {index === 3 && (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 absolute left-2"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 absolute right-2"
                      >
                        {' '}
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
                          clipRule="evenodd"
                        />{' '}
                      </svg>
                    </>
                  )}
                  {pauseShuffling && index === 3 && currentWinner ? (
                    <>
                      {/* Display address first , then Display name after 2 seconds */}
                      {!showName && (
                        <span className="animate-bounce">
                          From {currentWinner.address} Category!
                        </span>
                      )}

                      {showName && (
                        <span className="animate-bounce">
                          🎉🎉{currentWinner.name}🎉🎉
                        </span>
                      )}

                      {/* <span className="animate-bounce">
                        🎉🎉{currentWinner.name}🎉🎉
                      </span> */}
                    </>
                  ) : (
                    person.name
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Display list of winners */}

          {!stopped && showRaffleContainer && visibleNames.length > 0 && (
            <div className="mt-6 rounded-lg bg-white p-4 text-black">
              {currentWinners.length >= numWinners ? (
                <h2 className="text-2xl font-semibold text-center mb-4">
                  🎉🎉Congratulations! 🎉🎉
                </h2>
              ) : (
                <h2 className="text-xl font-bold text-center mb-4">
                  Drawing {numWinners}{' '}
                  {numWinners > 1 ? 'Winners...' : 'Winner...'}
                </h2>
              )}
              {currentWinners.map((winner, index) => (
                <div className="flex items-start space-x-4" key={index}>
                  <div className="font-bold text-xl">{index + 1}.</div>
                  <div className="text-black font-bold">
                    <div className="text-xl uppercase">
                      <span>
                        {winner.name} ({winner.address})
                      </span>{' '}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Display list of winners */}
      {viewAllWinners && (
        <div className="mt-4 w-80 bg-white p-4 rounded-lg shadow-md border text-black">
          <h2 className="text-xl font-semibold text-center mb-4">
            All Winners
          </h2>
          <ul className="h-40 overflow-auto">
            {winners.map((winner, index) => (
              <li key={index} className="mb-2">
                <strong>{winner.name}</strong>({winner.address})
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-auto p-4 text-white fixed bottom-0 w-full">
        <div className="flex space-x-4 justify-end">
          <div>
            {!shuffling && (
              <button
                onClick={() => setViewAllWinners(!viewAllWinners)}
                className=" bg-transparent text-white px-4 py-2 rounded-lg mb-4 "
              >
                V.W
              </button>
            )}
            {shuffling && (
              <button
                onClick={handleStop}
                className="hidden bg-transparent text-white px-4 py-2 rounded-lg mb-4 "
              >
                X
              </button>
            )}
          </div>
          <div className="flex-1"></div>

          {/* Password Input */}
          {/* <div>
            <label htmlFor="passkey" className="text-lg font-semibold mr-2">
              Passcode:
            </label>
            <input
              placeholder="Pass Key"
              type="password"
              disabled={shuffling}
              value={rafflePassword}
              onChange={(e) => setRafflePassword(e.target.value)}
              className="px-2 py-1 text-lg border bg-transparent rounded-md"
            />
          </div> */}
          {/* Division */}
          {/* <div>
            <label htmlFor="Division" className="text-lg font-semibold mr-2">
              Division:
            </label>
            <select
              id="Division"
              disabled={shuffling}
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="px-2 py-1 text-lg border bg-transparent rounded-md"
            >
              {divisions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div> */}

          {/* NumWinners Dropdown */}
          <div>
            <label htmlFor="numWinners" className="text-lg font-semibold mr-2">
              Draw:
            </label>
            <select
              id="numWinners"
              disabled={shuffling}
              value={numWinners}
              onChange={(e) => setNumWinners(parseInt(e.target.value, 10))}
              className="px-2 py-1 text-lg border bg-transparent rounded-md"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            {/* Spin Button */}
            {!shuffling && (
              <button
                onClick={startShuffling}
                className="bg-transparent border text-white px-4 py-1 rounded-lg ml-4"
              >
                Spin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RaffleApp
