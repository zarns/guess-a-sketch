import Link from 'next/link'
import Layout from '../components/Layout'

const AboutPage = () => (
  <Layout title="About">
    <div className="about-container">
      <h1 className="about-title">About</h1>
      <h3 className="about-text-box">
        <b>As described by ChatGPT:</b><br></br>
        Step right up, folks, and prepare to embark on a whimsical whirlwind of doodling 
        delight and guessing glee! Here's how our zany game unfolds: First, you'll be handed 
        a kooky keyword that you must bring to life with your artistic wizardry. 
        Then, pass your digital masterpiece to the next player, who will put on their 
        detective cap and try to guess what on Earth you've scribbled. But hold onto your socks, 
        because that guess becomes the next player's drawing prompt! This loop-de-loop of 
        sketching and guessing continues until everyone's had a turn, culminating in a hilarious 
        reveal of the flipbook of funnies! So grab your virtual crayons and get ready for a 
        rip-roaring, side-splitting, belly-laugh-inducing good time!
      </h3>
      <p>
        <a 
          href="https://mason.zarns.net" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="about-link"
        >
          Visit my Portfolio
        </a>
      </p>
      <p>
        <Link href="/">
          <span className="about-link">Go Home</span>
        </Link>
      </p>
    </div>
  </Layout>
)

export default AboutPage
