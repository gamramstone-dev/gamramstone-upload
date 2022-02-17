import { NextPage } from 'next'
import Head from 'next/head'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Main.module.scss'
import { classes } from '../utils/string'
import Logo from '../components/Logo'

const Privacy: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>감람스톤</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents, styles.heading)}>
          <div className={styles.inner}>
            <span>이세돌 - 왁타버스 번역 프로젝트</span>
            <div className={styles.logo}>
              <Logo size={32} stroke={3}></Logo>
              <span>감람스톤</span>
            </div>
            <span>개인정보 처리방침</span>
          </div>
        </div>
        <div className={classes(pageStyles.contents, styles.privacy)}>
          <p>
            <b> 발효일: 2021년 2월 17일</b>
          </p>
          <br></br>
          <p>
            감람스톤 홈페이지에 오신 것을 환영합니다!
            <br />본 페이지에서는 감람스톤 홈페이지 (&quot;사이트&quot; 혹은
            &quot;서비스&quot;) 를 이용함으로써 수집되는 개인정보의 목록을
            투명하게 공개하고 이러한 정보들이 어떻게 서비스에서 이용되고
            필요하다면 어떻게 저장되는지 본 서비스를 이용하는 모든 이용자에게
            알리기 위해 작성되었습니다.
          </p>
          <br></br>
          <br></br>
          <h2>수집하는 개인정보</h2>
          <p>
            감람스톤에서는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.
          </p>
          <br></br>
          <h3>Google 계정의 고유 ID 및 프로필 정보</h3>
          <p>
            이 정보를 서비스를 이용할 수 있는 이용자 식별, 사이트 내부에 정보
            표시 (이용자 이미지) 와 같은 목적으로 수집하고 이외의 목적으로는
            사용하지 않습니다. 이러한 정보는 페이지 오른쪽 상단의 로그인 버튼을
            클릭하고 Google 계정에 로그인하면 Upstash에서 관리하는
            데이터베이스에 수집되며, 목적 달성 시 혹은 로그인에 성공하였다면
            탈퇴 시점에 삭제됩니다.
          </p>
          <br></br>
          <h3>IP 주소</h3>
          <p>
            이 정보를 부정 사용 (사이트 거부 공격 등 사이트 운영에 차질이 생기는
            행위) 방지 및 이에 목적으로 수집하고 이외의 목적으로는 사용하지
            않습니다. 이러한 정보는 각 페이지 방문 시 수집되며, 수집 후 1일,
            필요 시 목적 달성 후 삭제됩니다. 이 정보는 Vercel Inc. 및 Better
            Stack에서 수집하며 이에 관한 개인정보 처리방침은{' '}
            <a href='https://vercel.com/legal/privacy-policy'>
              https://vercel.com/legal/privacy-policy
            </a>{' '}
            (영문) 및{' '}
            <a href='https://betterstack.com/privacy'>
              https://betterstack.com/privacy
            </a>{' '}
            (영문) 을 참조하세요.
          </p>
          <br></br>
          <h2>개인정보 국외이전</h2>
          <p>
            본 서비스는 전 세계 각지에 서버를 두고 있으며 Vercel (홈페이지
            호스팅 제공) 및 Upstash (데이터베이스 서비스 제공), Better Stack
            (로그 서비스 제공) 에 데이터가 이관될 수 있음을 알리며, 본 서비스
            이용 시 이에 동의하는 것으로 간주합니다.
          </p>
          <br></br>
          <h2>개인정보 삭제</h2>
          <p>
            본 서비스를 더는 이용하고 싶지 않을 때 언제든지 로그인 후 페이지
            오른쪽 상단의 프로필 사진을 클릭 후 보이는 페이지에서 회원 탈퇴를 할
            수 있습니다. 회원 탈퇴 시 저장된 Google 관련 정보는 모두 삭제되며 IP
            주소와 관련된 정보는 일정 기간 후 삭제됩니다.
            <br></br>
            만약 본 서비스에 로그인할 수 없는 경우에는 계정 소유를 증명할 수
            있는 정보를 포함하여 gamramstone (@) wesub.io 로 메일을 보내면 수신
            후 최대 7일 이내에 계정 및 정보를 삭제합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Privacy
