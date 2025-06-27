import React, { useState } from "react"
import { FloatingInput } from "@/components"
function Index() {
  const [name, setName] = useState("")
  return (
    <div>
      <h1>21313</h1>
      <FloatingInput
        id="name"
        label="名字"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
    </div>
  )
}

export default Index
