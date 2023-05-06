import type { GetStaticProps } from 'next'
import { useState } from 'react'
import ContentLoader from 'react-content-loader'
import DynamicRemoteApp from '../components/DynamicRemoteApp'
import styled from '@emotion/styled'
import appConfig from '../host-app-config.json'

const Button = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`

const SkeletonWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
`

type Props = {
  innerHTMLContents: Record<string, string>
}

const Home = ({ innerHTMLContents }: Props) => {
  console.log('Home rendered')

  const [parentCounter, setParentCounter] = useState(0)

  return (
    <div>
      <p>Hello from NextJS</p>
      <div>
        I am parent counter: {parentCounter}{' '}
        <Button onClick={() => setParentCounter((pc) => pc + 1)}>Increase Parent</Button>
      </div>
      {appConfig.remoteApps.map((remoteAppInfo) => (
        <DynamicRemoteApp
          // We are providing this dynamically, so this can be fetched with getStaticProps or on runtime at client side
          // this will be CDN host probably
          key={remoteAppInfo.appName}
          remoteAppInfo={remoteAppInfo}
          innerHTMLContent={innerHTMLContents[remoteAppInfo.appName]}
          skeletonThreshold={500}
          skeleton={
            <SkeletonWrapper>
              <ContentLoader speed={1} backgroundColor="#f6f6ef" foregroundColor="#e8e8e3">
                <rect x="0" y="4" rx="0" ry="0" width="210" height="13" />
                <rect x="220" y="4" rx="0" ry="0" width="50" height="13" />
              </ContentLoader>
            </SkeletonWrapper>
          }
        />
      ))}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const preReadyEmotionStyles = []
  const innerHTMLContents = {}

  for (let i = 0; i < appConfig.remoteApps.length; ++i) {
    const remoteAppInfo = appConfig.remoteApps[i]

    // This will be an express server in your custom host
    const preRender = await fetch(remoteAppInfo.prerender).then((res) => res.json())

    innerHTMLContents[preRender.appName] = preRender.content

    preReadyEmotionStyles.push({
      key: preRender.appName,
      styleId: preRender.styleId,
      styles: preRender.styles,
    })
  }

  return {
    props: {
      innerHTMLContents,
      preReadyEmotionStyles,
    },
  }
}
export default Home
