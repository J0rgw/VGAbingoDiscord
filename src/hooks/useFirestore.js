import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useUserVotes(userName) {
  const [votes, setVotes] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userName) return

    const docRef = doc(db, 'users', userName)

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setVotes(docSnap.data().votos || {})
      }
      setLoading(false)
    }, (error) => {
      console.error('Error fetching votes:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userName])

  const saveVote = useCallback(async (categoryId, nominee) => {
    if (!userName) return

    const docRef = doc(db, 'users', userName)
    const newVotes = { ...votes, [categoryId]: nominee }

    try {
      await setDoc(docRef, { votos: newVotes }, { merge: true })
      setVotes(newVotes)
    } catch (error) {
      console.error('Error saving vote:', error)
    }
  }, [userName, votes])

  return { votes, saveVote, loading }
}

export function useUserBingo(userName) {
  const [bingo, setBingo] = useState({
    cells: Array(25).fill(''),
    marked: Array(25).fill(false)
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userName) return

    const docRef = doc(db, 'users', userName)

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().bingo) {
        setBingo(docSnap.data().bingo)
      }
      setLoading(false)
    }, (error) => {
      console.error('Error fetching bingo:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userName])

  const saveBingo = useCallback(async (newBingo) => {
    if (!userName) return

    const docRef = doc(db, 'users', userName)

    try {
      await setDoc(docRef, { bingo: newBingo }, { merge: true })
      setBingo(newBingo)
    } catch (error) {
      console.error('Error saving bingo:', error)
    }
  }, [userName])

  const updateCell = useCallback((index, value) => {
    const newCells = [...bingo.cells]
    newCells[index] = value
    saveBingo({ ...bingo, cells: newCells })
  }, [bingo, saveBingo])

  const toggleMark = useCallback((index) => {
    const newMarked = [...bingo.marked]
    newMarked[index] = !newMarked[index]
    saveBingo({ ...bingo, marked: newMarked })
  }, [bingo, saveBingo])

  return { bingo, updateCell, toggleMark, loading }
}

export function useAllUsersData(users) {
  const [allData, setAllData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribes = []

    users.forEach((user) => {
      const docRef = doc(db, 'users', user)
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        setAllData((prev) => ({
          ...prev,
          [user]: docSnap.exists() ? docSnap.data() : null
        }))
      })
      unsubscribes.push(unsubscribe)
    })

    setLoading(false)

    return () => unsubscribes.forEach((unsub) => unsub())
  }, [users])

  return { allData, loading }
}
