import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { getSpeech } from "./api/getSpeach";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState();
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);
  async function onSubmit(event) {
    
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);

      getSpeech(data.result);

      setAnimalInput("");
      setIsLoading(false);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
      </Head>

      <main className={styles.main}>
        <h3>chatgpt 테스트</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="메세지 입력"
            value={animalInput}
            onChange={(e) => {setAnimalInput(e.target.value)}}
          />
          <input type="submit" value="메세지 보내기" />
        </form>

        <div className={styles.result}>{result}</div>
      {isLoading?<div style={{color:'red',fontSize:'30px', position:'fixed',top:0,bottom:0,left:0,right:0,backgroundColor:'black',opacity:'0.5',display:'flex',justifyContent:'center',alignItems:'center' }} >Loading...........</div>:""}
      </main>
    </div>
  );
}
