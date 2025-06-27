import React from "react"

const Home = () => {
  return <>
    {
      Array.from({ length: 50 }).map((_, index) => (
        <div key={index} style={{ padding: 20, color: "red" }}>
          Todo {index + 1}
        </div>
      ))
  }
  </>
}

export default Home