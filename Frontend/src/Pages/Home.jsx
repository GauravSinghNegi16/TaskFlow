import React from 'react'
import Navbar from '../Components/Navbar'
import Header from '../Components/Header'
import { useBoard } from "../context/BoardContext";
import TaskList from '../Components/TaskList';

const Home = () => {
  const { userBoards, loadBoard } = useBoard();
  return (
    <>
      <Navbar />
      <Header userBoards={userBoards} loadBoard={loadBoard} />
      <TaskList userBoards={userBoards} loadBoard={loadBoard} />
    </>
  )
}

export default Home