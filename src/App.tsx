import { useState } from 'react'
import './App.css'
import StudentManagement from './StudentManagement'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <StudentManagement/>
      </div>
      
    </>
  )
}

export default App
