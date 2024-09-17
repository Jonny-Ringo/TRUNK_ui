import { useEffect, useState } from 'react';
import { dryrun } from "@permaweb/aoconnect";

import Footer from './Footer';

const TRUNK = "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ"
const INITIAL_FRAME = "nOXJjj_vk0Dc1yCgdWD8kti_1iHruGzLQLNNBHVpN0Y"

function Home () {
    const [iframeSrc, setIframeSrc] = useState('');

    useEffect(() => {
        const getWebsite = async () => {
          try {
            const result = await dryrun({
              process: TRUNK,
              tags: [{ name: 'Action', value: "Get-Frame" }]
            });
            if (result) {
              return result.Messages[0].Data;
            } else {
              console.log("Got no response from dryrun!")
              return INITIAL_FRAME
            }
          } catch (e) {
            console.log(e);
          }
        };
    
        const setupIframe = async () => {
          const processResponse = await getWebsite();
          const url = `https://arweave.net/${processResponse}`;
          setIframeSrc(url);
        };
    
        setupIframe();
      }, []);
    return (
        <div>
            <div>
                <iframe title="Meme-Ception" className="w-full h-screen" src={iframeSrc} />
            </div>
            <Footer />
        </div>
	);
}

export default Home;
