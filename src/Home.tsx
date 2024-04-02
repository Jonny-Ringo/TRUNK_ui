import { useEffect, useState } from 'react';
import { dryrun } from "@permaweb/aoconnect";

import Footer from './Footer';

const TRUNK = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww"
const INITIAL_FRAME = "X5TgFGNgbje0JezztY5RL__VnYD9IieHa_9n9p0dMb0"

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
        <div className="flex flex-col h-screen justify-between">


            {/*<div>
                <iframe title="Meme-Ception" className="w-full h-screen" src={iframeSrc} />
            </div>*/}
            <header>
                <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                    <div className="flex flex-wrap max-w-screen-xl mx-auto">
                        <div className="flex justify-end w-full">
                            <a href="#"
                               className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-bold rounded-lg text-lg lg:px-0 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                                Built on</a>
                            <img className="w-12" src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzOTUuNDcgMzk1LjQ3Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiBub25lOwogICAgICAgIHN0cm9rZTogIzAwMDsKICAgICAgICBzdHJva2UtbWl0ZXJsaW1pdDogMTA7CiAgICAgICAgc3Ryb2tlLXdpZHRoOiA3cHg7CiAgICAgIH0KCiAgICAgIC5jbHMtMiB7CiAgICAgICAgZmlsbC1ydWxlOiBldmVub2RkOwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogICAgPGc+CiAgICAgIDxwYXRoIGQ9Im01Ny40NywyNjIuNWg0NS4zMWw5LjI1LTI1LjAxLTIwLjgxLTQyLjYtMzMuNzUsNjcuNjFaIi8+CiAgICAgIDxwYXRoIGQ9Im0xNzcuNjgsMjI4LjdsLTUwLjQtMTAxLjQxLTE1LjI2LDM0LjczLDQ3LjYyLDEwMC40OGgzNC4zbC0xNi4yNy0zMy44WiIvPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im0yNjEuODgsMjYyLjVjMzcuNTEsMCw2Ny45Mi0zMC40MSw2Ny45Mi02Ny45MnMtMzAuNDEtNjcuOTItNjcuOTItNjcuOTItNjcuOTIsMzAuNDEtNjcuOTIsNjcuOTIsMzAuNDEsNjcuOTIsNjcuOTIsNjcuOTJabTAtMjYuNjZjMjIuNzksMCw0MS4yNi0xOC40Nyw0MS4yNi00MS4yNnMtMTguNDctNDEuMjYtNDEuMjYtNDEuMjYtNDEuMjYsMTguNDctNDEuMjYsNDEuMjYsMTguNDcsNDEuMjYsNDEuMjYsNDEuMjZaIi8+CiAgICA8L2c+CiAgICA8Y2lyY2xlIGNsYXNzPSJjbHMtMSIgY3g9IjE5Ny43MyIgY3k9IjE5Ny43MyIgcj0iMTk0LjIzIi8+CiAgPC9nPgo8L3N2Zz4='/>
                        </div>
                    </div>
                </nav>
            </header>

            <section className="bg-white dark:bg-gray-900">
                <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-12">
                    <img className="w-48 mx-auto mb-12" src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MjQgNTI0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xLCAuY2xzLTIgewogICAgICAgIHN0cm9rZTogIzAwMDsKICAgICAgICBzdHJva2UtbWl0ZXJsaW1pdDogMTA7CiAgICAgIH0KCiAgICAgIC5jbHMtMiB7CiAgICAgICAgZmlsbDogIzAxMDEwMTsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPGcgaWQ9IkxheWVyXzEtMiIgZGF0YS1uYW1lPSJMYXllciAxIj4KICAgIDxnPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Im0zNjkuMzgsMTExLjcyYzcuMy01LjgyLDExLjk5LTEuNzUsMTkuNTMsMi4zOXMxNC43Niw5LjE0LDE5Ljg2LDE2LjE2YzQuNCw2LjA1LDYuOTcsMTMuMjIsOS4xNSwyMC4zOCwxLjg5LDYuMiwzLjU3LDEyLjYzLDMuNjcsMTkuMTUuMSw2LjY0LTIuNjcsMTIuNjgtMi44MywxOS4xMi0uMTMsNC45NiwxLjIyLDEwLjM0LDEuNSwxNS4zNC41Niw5LjkxLjUyLDE5Ljg1LDEuNjMsMjkuNzIsMi40OCwyMi4wNSwxMi43NCwzNi4yMSwyOC4wMSw1MS40MS41Mi41MiwxLjA5LDEuMDEsMS42NiwxLjQ4LDYuNjgsNS41MS0xMC4xMyw1LjE0LTEzLjc0LDMuMTQtNS43Mi0zLjE3LTkuNjMtOC45MS0xNS4zMS0xMS45OS0uMDYsMy4wMy40Myw2LjA5LjM3LDkuMTQtLjM5LDE5LjgtMi41NSwzOS43Mi0yLjU1LDU5LjQ4LS4yNiw0LjAzLTEuNiw4LjIyLTEuMzgsMTIuMjIuMTUsMi42NywxLjMsNS40MiwzLjU2LDYuODMsMS40NS45LDMuMjEsMS4xOCw0Ljc1LDEuOTIsNS4xLDIuNDUsMy40MSwxMi4xNS0yLjE3LDEyLjg1LTMuNDIuNDMtOC4wMi0uOTQtMTEuNDYtMS4zOS00LjMtLjU2LTExLjAxLTkuNTItMTIuNzEtMTMuMTctMy4wNi02LjU2LTMuMTgtMTUuNzgtNC4wMS0yMi45LTMuMTItMjYuNjMtNi42MS01Mi41Ny0xNi4zOC03Ny43My0zLjQxLTguNzktOC43Mi0xNy4xMS0xMS4zNS0yNi4xNC0uMTctLjU4LS4zNC0xLjE5LS43LTEuNjctLjczLS45Ny0yLjA3LTEuMjQtMy4yOS0xLjMtNS45Mi0uMjctMTEuNzgsMi44NS0xNy41OSwxLjY4LDMuNDkuNyw1LjY5LDE1LjUxLDYuNywxOC4xMi44LDIuMDgsMS44OCw0LjE2LDEuODEsNi4zOXMtMS45MSw0LjYtNC4xMiw0LjI0Yy0yLjUxLS40MS0zLjczLTMuOTEtNi4yNy00LjA0LTEuOTQtLjEtMy4zNSwxLjg1LTUuMTksMi40Ni0xLjg0LjYyLTMuOTEtLjIxLTUuMy0xLjU2cy0yLjI0LTMuMTUtMy4wNS00LjljLTMuNCw0LjA1LTEuNDgsMTAuMzctMS4yLDE1LjE0LjQyLDYuODguNjIsMTMuNzYuNzQsMjAuNjUuMjMsMTMuNzguMDEsMjcuNTYtLjA5LDQxLjM0LS4wOSwxMC45OS0uMTIsMjEuOTkuMTgsMzIuOTguMjEsNy43Mi0yLjEsMTkuNyw1Ljg2LDIzLjk2LDUuNTMsMi45Niw2Ljk2LDguODgsMy41NiwxNC4yOC00LjI2LDYuNzYtMTkuNzMsMTAuNzktMjcuMTcsMTAuNjgtNi4yLS4wOS0xMi43Ni0zLjA3LTE1LjY0LTguODEtNC44LTkuNTgsNC41Ny0xNy4xMywxLjI1LTI2LjgxLTIuNzgtOC4wOS00LjU0LTE2LjUyLTUuMjYtMjUuMDQtLjE3LTIuMDQtMi4wNy0xNy45LS4wMy0xOC45OS4xOS0uMS4zNy0uMi41Ni0uMy0uMTktLjE4LS4zNy0uMzctLjU2LS41NSwwLS4yNC0uMDYtLjQ4LS4xNi0uNy0uMTgtLjc2LS4zNi0xLjUyLS41NC0yLjI3LS4wNy0xLjk5LS4xNC0zLjk4LS4yMS01Ljk2LDAtLjI1LDAtLjUuMDEtLjc1LS43MS00LjM3LTEuNTItOC43My0yLjEtMTMuMTItLjg1LTYuNDYtMS40LTEyLjk3LTIuMzQtMTkuNDItLjMyLTIuMTctMS40NS00LjIyLTIuMjEtNi4zMi0uNTEtLjc3LTEuMDMtMS41NC0xLjU0LTIuMzEtLjIzLS4yNC0uNDctLjQ3LS43LS43MS0uNTEtLjc2LTEuMDEtMS41My0xLjUtMi4yNy0uNTItLjc1LTEuMDQtMS41MS0xLjU2LTIuMjYtMS4yMi4wMy0yLjQ1LjA3LTMuNjcuMS0uMjcuMi0uNTQuNC0uOC42LTUuMjksMy45My03LjA3LDEyLjgyLTguNTQsMTguNzktMi4zOCw5LjY1LTQuNywxOS4zMS03LjA1LDI4Ljk3LTUuNzIsMjIuODYtMTEsNDUuODEtMTcuMSw2OC41Ny0uMjEuNzgtLjM1LDEuODItLjAxLDIuNDgsMi43OCw1LjU2LDIuMzcsMTEuNTYsMS43MiwxNy41NC0uNyw2LjQ4LTIuMiw4LjQ0LTguOTMsOS40Ni01LjI5LjgtMTAuNjIsMS42MS0xNS45NywxLjI5LTkuMDctLjUzLTE4LjI5LTQuNC0xNy41LTE0LjgzLjQ1LTUuOTQsMy41OC0xMS4yOCw2LjA2LTE2LjcsOC45Ny0xOS42MywxMC44NC00Mi43NSwxMC45OC02NC4wOS4wNC02LjY2LDIuMzEtMjUuMDMtNy45LTIwLjk5LTE1LjcxLDYuMjItMzIuMTcsMTAuNTMtNDguOTEsMTIuNzktMS4wMy4xNC0yLjEyLjI5LTIuOTYuOTEtNS4xMiwzLjc4LS41NiwyNy45OC4wNywzMy42MywxLjIsMTAuNzQsMy4wMSwyNy42OSw4Ljk5LDM2LjgzLDEuNzgsMi43Miw0LjI0LDQuOTQsNi4wNCw3LjY0LDIuMjUsMy4zOSwzLjM4LDcuNTEsMy4xOSwxMS41OC0uMSwxLjk5LS41OCw0LjEtMi4wNCw1LjQ1LTUuMzEsNC45MS0yMy4zNiwyLjQyLTI5LjQ3LjM4LTIuNDktLjgzLTQuNTUtMi41OS02LjM0LTQuNTEtMi0yLjEzLTMuNzgtNC41OC00LjU3LTcuNC0xLjQtNS4wMi41OC05Ljk1LDEuMDYtMTQuOTMuNTMtNS41Ny0uNzktMTAuNTUtMi43NC0xNS43Ny0xLjQ3LTMuOTQtMy4wNC03LjgzLTQuNjgtMTEuNzEtNC4yNi0xMC4xLTguNzMtMjAuMjctMTMuODItMjkuOTgtMi4wMy0zLjg4LTQuMjUtNy42OC02LjA1LTExLjY3LTEuNzYtMy45MS0yLjk4LTguMDYtNC42NC0xMi4wMS0yLjQ0LTUuODItNS4zNC0xMS40NS03LjUzLTE3LjM2LTIuNDktNi43Mi00LjM5LTEzLjY2LTYuNTgtMjAuNS0uNDQtMS4zNy0uODEtNC42LTIuODMtNC41Ny01LjA5LDEzLjM0LTUuMjIsMjcuNzgtNi4zMiw0MS44My0xLjExLDE0LjEyLTMuMzgsMjcuOTYtMi4xMyw0Mi4xOC4xMSwxLjI0LjIxLDIuNTgtLjQ2LDMuNjItMS4xNSwxLjc1LTMuOTksMS41NC01LjUuMDlzLTIuMDEtMy42NC0yLjM1LTUuN2MtMi4yMi0xMy43OC0xLjE3LTI4LjY5LS42OS00Mi41OC42OC0xOS42MywyLjI5LTM5LjE5LDIuNDQtNTguODUuMDUtNS44OC4xOS0xMS43Ny43OC0xNy42MywxLjE3LTExLjQyLDIuNzMtMjMuMDMsNi4xMi0zMy45NCwzLjE4LTEwLjE5LDguMjgtMTkuOTksMTMuODQtMjkuMTcsNS4wMi04LjMsMTEuMTEtMTYuMjMsMTguMDEtMjMuMDMsNy4yLTcuMSwxNS44Mi0xMi44MSwyNC4wMi0xOC44Niw5LjYtNy4wOSwyMC44Mi0xMC4wOCwzMi4zOC0xMiwzLjIyLS41NCw2LjQ0LTEuMDUsOS42Ni0xLjU4LDE5LjMyLTMuMTcsNDMuMzYuMzMsNjIuMDIsNS40OC0xMC40OCw3LjI1LTIwLjc5LDE2Ljc1LTIyLjg0LDI5LjMyLTEuMzIsOC4xLDEuMDQsMTYuMzksNC41MSwyMy44NCw2Ljk2LDE0Ljk1LDE4LjU0LDI3LjcsMzIuNzQsMzYuMDYtNy4xOC0xMC41Ny0xNi43OC0xOS4zNC0yMy43Ny0zMC4wNC02Ljk5LTEwLjctMTEuMTctMjQuNTctNS45OS0zNi4yNSw0LjI5LTkuNjksMTMuNjYtMTUuNCwyMS42NS0yMS43Miw4Ljg4LTcuMDMsMTYuNzctMTUuNDMsMjYuNjItMjEuMTcsMTguNTctMTAuODMsNDUuMjEtNS4yNiw2Mi4yLDYuNCwzLjMzLDIuMjksNi41Nyw0LjgzLDEwLjM2LDYuMjIsNi41NCwyLjQsMTMuNTgsMS4zLDIwLjI2LjI4LjczLS4xMSwxLjM1LS45OSwyLjAyLTEuNTEuMjUtLjIuNTEtLjQuNzYtLjZabS0xMTEuOTksOTkuMTRjLjAyLjA4LDAsLjIuMDYuMjMuMDcuMDUuMTguMDQuMjguMDYtLjAzLS4xMy0uMDUtLjI2LS4wOC0uMzlsLS4yNi4xWiIvPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im0xMjMuNTMsNDA1LjU5Yy01LjQ3LDUuOC0xNyw1LjUzLTI0LjI5LDEuMzQtNy44LTQuNDgtOC45MS02LjQ1LTYuMzEtMTUuMTMsMy4zMS0xMS4wMyw3LjA3LTIxLjkzLDEwLjU1LTMyLjkyLDEuOTItNi4wNCwzLjY3LTEyLjE0LDUuNjItMTguNjMuNTQtMS43OCw2Ljg3LDguNjMsNy4xNiw5LjIxLDIuNDQsNC44NSw0LjIzLDEwLjAxLDUuNTgsMTUuMjYsMi42MiwxMC4xOSw0LjQ5LDIxLjU1LDQuNzYsMzIuMDcuMSwzLjc5LTEuMDksNi42OS0zLjA3LDguNzlaIi8+CiAgICA8L2c+CiAgICA8cGF0aCBkPSJtMjYyLDUyNGMtNjkuOTgsMC0xMzUuNzgtMjcuMjUtMTg1LjI2LTc2Ljc0QzI3LjI1LDM5Ny43OCwwLDMzMS45OCwwLDI2MlMyNy4yNSwxMjYuMjIsNzYuNzQsNzYuNzRDMTI2LjIyLDI3LjI1LDE5Mi4wMiwwLDI2MiwwczEzNS43OCwyNy4yNSwxODUuMjYsNzYuNzRjNDkuNDksNDkuNDgsNzYuNzQsMTE1LjI4LDc2Ljc0LDE4NS4yNnMtMjcuMjUsMTM1Ljc4LTc2Ljc0LDE4NS4yNmMtNDkuNDgsNDkuNDktMTE1LjI4LDc2Ljc0LTE4NS4yNiw3Ni43NFptMC00OTdjLTYyLjc3LDAtMTIxLjc4LDI0LjQ0LTE2Ni4xNyw2OC44M1MyNywxOTkuMjMsMjcsMjYyczI0LjQ0LDEyMS43OCw2OC44MywxNjYuMTdjNDQuMzksNDQuMzksMTAzLjQsNjguODMsMTY2LjE3LDY4LjgzczEyMS43OC0yNC40NCwxNjYuMTctNjguODNjNDQuMzktNDQuMzksNjguODMtMTAzLjQsNjguODMtMTY2LjE3cy0yNC40NC0xMjEuNzgtNjguODMtMTY2LjE3UzMyNC43NywyNywyNjIsMjdaIi8+CiAgPC9nPgo8L3N2Zz4=' />

                    <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        Welcome to the TRUNK community, on AOS!
                    </h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                        The TRUNK token is the first meme token of it's kind, that is used to vote on the contents of this page!
                        Mint $TRUNK by depositting $CRED tokens into the DAO, only 10000 $TRUNK can be minted! Once you hold $TRUNK, you can stake them in the DAO to vote on the contents of this page!
                        Let's build a community together on the permaweb!
                    </p>
                    <div
                        className="flex flex-col mb-8 space-y-4 lg:mb-16 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        <a href="#"
                           className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-gray-900 rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 dark:focus:ring-blue-900">
                            Connect
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                      clip-rule="evenodd"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
            <footer className="p-4 bg-gray-100 sm:p-6 dark:bg-gray-800">
                <div className="max-w-screen-xl mx-auto">
                    <div className="md:flex md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <a href="#" className="flex items-center">
                                <img alt="Trunk Logo" className="w-16 mr-3" src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MjQgNTI0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xLCAuY2xzLTIgewogICAgICAgIHN0cm9rZTogIzAwMDsKICAgICAgICBzdHJva2UtbWl0ZXJsaW1pdDogMTA7CiAgICAgIH0KCiAgICAgIC5jbHMtMiB7CiAgICAgICAgZmlsbDogIzAxMDEwMTsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPGcgaWQ9IkxheWVyXzEtMiIgZGF0YS1uYW1lPSJMYXllciAxIj4KICAgIDxnPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Im0zNjkuMzgsMTExLjcyYzcuMy01LjgyLDExLjk5LTEuNzUsMTkuNTMsMi4zOXMxNC43Niw5LjE0LDE5Ljg2LDE2LjE2YzQuNCw2LjA1LDYuOTcsMTMuMjIsOS4xNSwyMC4zOCwxLjg5LDYuMiwzLjU3LDEyLjYzLDMuNjcsMTkuMTUuMSw2LjY0LTIuNjcsMTIuNjgtMi44MywxOS4xMi0uMTMsNC45NiwxLjIyLDEwLjM0LDEuNSwxNS4zNC41Niw5LjkxLjUyLDE5Ljg1LDEuNjMsMjkuNzIsMi40OCwyMi4wNSwxMi43NCwzNi4yMSwyOC4wMSw1MS40MS41Mi41MiwxLjA5LDEuMDEsMS42NiwxLjQ4LDYuNjgsNS41MS0xMC4xMyw1LjE0LTEzLjc0LDMuMTQtNS43Mi0zLjE3LTkuNjMtOC45MS0xNS4zMS0xMS45OS0uMDYsMy4wMy40Myw2LjA5LjM3LDkuMTQtLjM5LDE5LjgtMi41NSwzOS43Mi0yLjU1LDU5LjQ4LS4yNiw0LjAzLTEuNiw4LjIyLTEuMzgsMTIuMjIuMTUsMi42NywxLjMsNS40MiwzLjU2LDYuODMsMS40NS45LDMuMjEsMS4xOCw0Ljc1LDEuOTIsNS4xLDIuNDUsMy40MSwxMi4xNS0yLjE3LDEyLjg1LTMuNDIuNDMtOC4wMi0uOTQtMTEuNDYtMS4zOS00LjMtLjU2LTExLjAxLTkuNTItMTIuNzEtMTMuMTctMy4wNi02LjU2LTMuMTgtMTUuNzgtNC4wMS0yMi45LTMuMTItMjYuNjMtNi42MS01Mi41Ny0xNi4zOC03Ny43My0zLjQxLTguNzktOC43Mi0xNy4xMS0xMS4zNS0yNi4xNC0uMTctLjU4LS4zNC0xLjE5LS43LTEuNjctLjczLS45Ny0yLjA3LTEuMjQtMy4yOS0xLjMtNS45Mi0uMjctMTEuNzgsMi44NS0xNy41OSwxLjY4LDMuNDkuNyw1LjY5LDE1LjUxLDYuNywxOC4xMi44LDIuMDgsMS44OCw0LjE2LDEuODEsNi4zOXMtMS45MSw0LjYtNC4xMiw0LjI0Yy0yLjUxLS40MS0zLjczLTMuOTEtNi4yNy00LjA0LTEuOTQtLjEtMy4zNSwxLjg1LTUuMTksMi40Ni0xLjg0LjYyLTMuOTEtLjIxLTUuMy0xLjU2cy0yLjI0LTMuMTUtMy4wNS00LjljLTMuNCw0LjA1LTEuNDgsMTAuMzctMS4yLDE1LjE0LjQyLDYuODguNjIsMTMuNzYuNzQsMjAuNjUuMjMsMTMuNzguMDEsMjcuNTYtLjA5LDQxLjM0LS4wOSwxMC45OS0uMTIsMjEuOTkuMTgsMzIuOTguMjEsNy43Mi0yLjEsMTkuNyw1Ljg2LDIzLjk2LDUuNTMsMi45Niw2Ljk2LDguODgsMy41NiwxNC4yOC00LjI2LDYuNzYtMTkuNzMsMTAuNzktMjcuMTcsMTAuNjgtNi4yLS4wOS0xMi43Ni0zLjA3LTE1LjY0LTguODEtNC44LTkuNTgsNC41Ny0xNy4xMywxLjI1LTI2LjgxLTIuNzgtOC4wOS00LjU0LTE2LjUyLTUuMjYtMjUuMDQtLjE3LTIuMDQtMi4wNy0xNy45LS4wMy0xOC45OS4xOS0uMS4zNy0uMi41Ni0uMy0uMTktLjE4LS4zNy0uMzctLjU2LS41NSwwLS4yNC0uMDYtLjQ4LS4xNi0uNy0uMTgtLjc2LS4zNi0xLjUyLS41NC0yLjI3LS4wNy0xLjk5LS4xNC0zLjk4LS4yMS01Ljk2LDAtLjI1LDAtLjUuMDEtLjc1LS43MS00LjM3LTEuNTItOC43My0yLjEtMTMuMTItLjg1LTYuNDYtMS40LTEyLjk3LTIuMzQtMTkuNDItLjMyLTIuMTctMS40NS00LjIyLTIuMjEtNi4zMi0uNTEtLjc3LTEuMDMtMS41NC0xLjU0LTIuMzEtLjIzLS4yNC0uNDctLjQ3LS43LS43MS0uNTEtLjc2LTEuMDEtMS41My0xLjUtMi4yNy0uNTItLjc1LTEuMDQtMS41MS0xLjU2LTIuMjYtMS4yMi4wMy0yLjQ1LjA3LTMuNjcuMS0uMjcuMi0uNTQuNC0uOC42LTUuMjksMy45My03LjA3LDEyLjgyLTguNTQsMTguNzktMi4zOCw5LjY1LTQuNywxOS4zMS03LjA1LDI4Ljk3LTUuNzIsMjIuODYtMTEsNDUuODEtMTcuMSw2OC41Ny0uMjEuNzgtLjM1LDEuODItLjAxLDIuNDgsMi43OCw1LjU2LDIuMzcsMTEuNTYsMS43MiwxNy41NC0uNyw2LjQ4LTIuMiw4LjQ0LTguOTMsOS40Ni01LjI5LjgtMTAuNjIsMS42MS0xNS45NywxLjI5LTkuMDctLjUzLTE4LjI5LTQuNC0xNy41LTE0LjgzLjQ1LTUuOTQsMy41OC0xMS4yOCw2LjA2LTE2LjcsOC45Ny0xOS42MywxMC44NC00Mi43NSwxMC45OC02NC4wOS4wNC02LjY2LDIuMzEtMjUuMDMtNy45LTIwLjk5LTE1LjcxLDYuMjItMzIuMTcsMTAuNTMtNDguOTEsMTIuNzktMS4wMy4xNC0yLjEyLjI5LTIuOTYuOTEtNS4xMiwzLjc4LS41NiwyNy45OC4wNywzMy42MywxLjIsMTAuNzQsMy4wMSwyNy42OSw4Ljk5LDM2LjgzLDEuNzgsMi43Miw0LjI0LDQuOTQsNi4wNCw3LjY0LDIuMjUsMy4zOSwzLjM4LDcuNTEsMy4xOSwxMS41OC0uMSwxLjk5LS41OCw0LjEtMi4wNCw1LjQ1LTUuMzEsNC45MS0yMy4zNiwyLjQyLTI5LjQ3LjM4LTIuNDktLjgzLTQuNTUtMi41OS02LjM0LTQuNTEtMi0yLjEzLTMuNzgtNC41OC00LjU3LTcuNC0xLjQtNS4wMi41OC05Ljk1LDEuMDYtMTQuOTMuNTMtNS41Ny0uNzktMTAuNTUtMi43NC0xNS43Ny0xLjQ3LTMuOTQtMy4wNC03LjgzLTQuNjgtMTEuNzEtNC4yNi0xMC4xLTguNzMtMjAuMjctMTMuODItMjkuOTgtMi4wMy0zLjg4LTQuMjUtNy42OC02LjA1LTExLjY3LTEuNzYtMy45MS0yLjk4LTguMDYtNC42NC0xMi4wMS0yLjQ0LTUuODItNS4zNC0xMS40NS03LjUzLTE3LjM2LTIuNDktNi43Mi00LjM5LTEzLjY2LTYuNTgtMjAuNS0uNDQtMS4zNy0uODEtNC42LTIuODMtNC41Ny01LjA5LDEzLjM0LTUuMjIsMjcuNzgtNi4zMiw0MS44My0xLjExLDE0LjEyLTMuMzgsMjcuOTYtMi4xMyw0Mi4xOC4xMSwxLjI0LjIxLDIuNTgtLjQ2LDMuNjItMS4xNSwxLjc1LTMuOTksMS41NC01LjUuMDlzLTIuMDEtMy42NC0yLjM1LTUuN2MtMi4yMi0xMy43OC0xLjE3LTI4LjY5LS42OS00Mi41OC42OC0xOS42MywyLjI5LTM5LjE5LDIuNDQtNTguODUuMDUtNS44OC4xOS0xMS43Ny43OC0xNy42MywxLjE3LTExLjQyLDIuNzMtMjMuMDMsNi4xMi0zMy45NCwzLjE4LTEwLjE5LDguMjgtMTkuOTksMTMuODQtMjkuMTcsNS4wMi04LjMsMTEuMTEtMTYuMjMsMTguMDEtMjMuMDMsNy4yLTcuMSwxNS44Mi0xMi44MSwyNC4wMi0xOC44Niw5LjYtNy4wOSwyMC44Mi0xMC4wOCwzMi4zOC0xMiwzLjIyLS41NCw2LjQ0LTEuMDUsOS42Ni0xLjU4LDE5LjMyLTMuMTcsNDMuMzYuMzMsNjIuMDIsNS40OC0xMC40OCw3LjI1LTIwLjc5LDE2Ljc1LTIyLjg0LDI5LjMyLTEuMzIsOC4xLDEuMDQsMTYuMzksNC41MSwyMy44NCw2Ljk2LDE0Ljk1LDE4LjU0LDI3LjcsMzIuNzQsMzYuMDYtNy4xOC0xMC41Ny0xNi43OC0xOS4zNC0yMy43Ny0zMC4wNC02Ljk5LTEwLjctMTEuMTctMjQuNTctNS45OS0zNi4yNSw0LjI5LTkuNjksMTMuNjYtMTUuNCwyMS42NS0yMS43Miw4Ljg4LTcuMDMsMTYuNzctMTUuNDMsMjYuNjItMjEuMTcsMTguNTctMTAuODMsNDUuMjEtNS4yNiw2Mi4yLDYuNCwzLjMzLDIuMjksNi41Nyw0LjgzLDEwLjM2LDYuMjIsNi41NCwyLjQsMTMuNTgsMS4zLDIwLjI2LjI4LjczLS4xMSwxLjM1LS45OSwyLjAyLTEuNTEuMjUtLjIuNTEtLjQuNzYtLjZabS0xMTEuOTksOTkuMTRjLjAyLjA4LDAsLjIuMDYuMjMuMDcuMDUuMTguMDQuMjguMDYtLjAzLS4xMy0uMDUtLjI2LS4wOC0uMzlsLS4yNi4xWiIvPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im0xMjMuNTMsNDA1LjU5Yy01LjQ3LDUuOC0xNyw1LjUzLTI0LjI5LDEuMzQtNy44LTQuNDgtOC45MS02LjQ1LTYuMzEtMTUuMTMsMy4zMS0xMS4wMyw3LjA3LTIxLjkzLDEwLjU1LTMyLjkyLDEuOTItNi4wNCwzLjY3LTEyLjE0LDUuNjItMTguNjMuNTQtMS43OCw2Ljg3LDguNjMsNy4xNiw5LjIxLDIuNDQsNC44NSw0LjIzLDEwLjAxLDUuNTgsMTUuMjYsMi42MiwxMC4xOSw0LjQ5LDIxLjU1LDQuNzYsMzIuMDcuMSwzLjc5LTEuMDksNi42OS0zLjA3LDguNzlaIi8+CiAgICA8L2c+CiAgICA8cGF0aCBkPSJtMjYyLDUyNGMtNjkuOTgsMC0xMzUuNzgtMjcuMjUtMTg1LjI2LTc2Ljc0QzI3LjI1LDM5Ny43OCwwLDMzMS45OCwwLDI2MlMyNy4yNSwxMjYuMjIsNzYuNzQsNzYuNzRDMTI2LjIyLDI3LjI1LDE5Mi4wMiwwLDI2MiwwczEzNS43OCwyNy4yNSwxODUuMjYsNzYuNzRjNDkuNDksNDkuNDgsNzYuNzQsMTE1LjI4LDc2Ljc0LDE4NS4yNnMtMjcuMjUsMTM1Ljc4LTc2Ljc0LDE4NS4yNmMtNDkuNDgsNDkuNDktMTE1LjI4LDc2Ljc0LTE4NS4yNiw3Ni43NFptMC00OTdjLTYyLjc3LDAtMTIxLjc4LDI0LjQ0LTE2Ni4xNyw2OC44M1MyNywxOTkuMjMsMjcsMjYyczI0LjQ0LDEyMS43OCw2OC44MywxNjYuMTdjNDQuMzksNDQuMzksMTAzLjQsNjguODMsMTY2LjE3LDY4LjgzczEyMS43OC0yNC40NCwxNjYuMTctNjguODNjNDQuMzktNDQuMzksNjguODMtMTAzLjQsNjguODMtMTY2LjE3cy0yNC40NC0xMjEuNzgtNjguODMtMTY2LjE3UzMyNC43NywyNywyNjIsMjdaIi8+CiAgPC9nPgo8L3N2Zz4=' />
                            </a>
                        </div>
                        <div className="grid grid-cols-1 text-right">
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Have some fun</h2>
                                <ul className="text-gray-600 dark:text-gray-400">
                                    <li className="mb-4">
                                        <a href="https://bark.arweave.dev/#/" className="hover:underline">Swap Trunk</a>
                                    </li>
                                    <li>
                                        <a href="https://trunkao.xyz/#/vote/" className="hover:underline">Vote</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8"/>
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">2024 <a
                            href="#" className="hover:underline">TRUNK</a>
                        </span>
                        <div className="flex mt-2 sm:justify-center sm:mt-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill-rule="evenodd"
                                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                      clip-rule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </footer>

            {/*<Footer />*/}
        </div>
	);
}

export default Home;
