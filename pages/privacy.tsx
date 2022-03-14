import { NextPage } from 'next'
import Head from 'next/head'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Main.module.scss'
import { classes } from '../utils/string'
import Logo from '../components/Logo'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../components/Button'

const Korean = (
  <div className={classes(pageStyles.contents, styles.privacy)}>
    <p>
      <b> 발효일: 2021년 3월 14일 (KST), 마지막 수정 : 2021년 3월 14일 (KST)</b>
    </p>
    <br></br>
    <p>
      감람스톤 홈페이지에 오신 것을 환영합니다!
      <br />본 페이지에서는 감람스톤 홈페이지 (&quot;사이트&quot; 혹은
      &quot;서비스&quot;) 를 이용함으로써 수집되는 개인정보의 목록을 투명하게
      공개하고 이러한 정보들이 어떻게 서비스에서 이용되고 저장되는지 본 서비스를
      이용하는 모든 이용자에게 알리기 위해 작성되었습니다.
    </p>
    <br></br>
    <br></br>
    <h2>연락처</h2>
    <p>
      계정 관련 문의 및 기타 건의 사항이 있으실 경우 이메일 주소{' '}
      <a href='mailto:gamramstone@wesub.io'>gamramstone@wesub.io</a> 로
      문의해주시길 바랍니다.
    </p>
    <br></br>
    <br></br>
    <h2>수집하는 개인정보</h2>
    <p>감람스톤에서는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</p>
    <br></br>
    <h3>Google 계정의 고유 ID 및 프로필 정보</h3>
    <p>
      이 정보를 서비스를 이용할 수 있는 이용자 식별, 사이트 내부에 정보 표시
      (이용자 이미지) 와 같은 목적으로 수집하고 이외의 목적으로는 사용하지
      않습니다. 프로필과 같은 사용자 데이터는 데이터베이스에 저장되지 않고
      사용자 식별 용도로 사용하는 ID는 Upstash에서 관리하는 데이터베이스에
      저장되며, 탈퇴 시점에 삭제됩니다.
    </p>
    <br></br>
    <h3>IP 주소</h3>
    <p>
      이 정보를 부정 사용 (사이트 거부 공격 등 사이트 운영에 차질이 생기는 행위)
      방지 및 발생시 관계당국에 신고할 목적으로 수집하고 이외의 목적으로는
      사용하지 않습니다. 이러한 정보는 각 페이지 방문 및 API 요청 시 수집되며,
      수집 후 최대 7일 혹은 필요 시 목적 달성 후 삭제됩니다.
      <br></br>이 정보는 Vercel Inc. 및 Better Stack에서 수집하며 이에 관한
      개인정보 처리방침은{' '}
      <a href='https://vercel.com/legal/privacy-policy'>
        https://vercel.com/legal/privacy-policy
      </a>{' '}
      (영문) 및{' '}
      <a href='https://betterstack.com/privacy'>
        https://betterstack.com/privacy
      </a>{' '}
      (영문) 을 참고하세요.
    </p>
    <br></br>
    <h2>개인정보 국외이전</h2>
    <p>
      본 서비스는 전 세계 각지에 서버를 두고 있어 Vercel (홈페이지 호스팅 제공)
      및 Upstash (데이터베이스 서비스 제공), Better Stack (로그 서비스 제공) 에
      데이터가 이관될 수 있음을 알리며, 본 서비스 이용 시 이에 동의하는 것으로
      간주합니다.
    </p>
    <br></br>
    <h2>개인정보 삭제</h2>
    <p>
      본 서비스를 더는 이용하고 싶지 않을 때 언제든지 계정 관리 페이지에서 회원
      탈퇴 버튼을 클릭하여 계정을 삭제할 수 있습니다. 회원 탈퇴 시 저장된 Google
      관련 정보는 모두 삭제되며 IP 주소와 관련된 정보는 일정 기간 후 삭제됩니다.
      <br></br>
      만약 본 서비스에 로그인할 수 없는 경우에는 계정 소유를 증명할 수 있는
      정보를 포함하여 gamramstone (@) wesub.io 로 메일을 보내면 수신 후 최대 7일
      이내에 계정 및 정보를 삭제합니다.
    </p>
    <br></br>
    <h2>Google 계정 데이터 (토큰) 의 사용</h2>
    <p>
      본 서비스는 크리에이터가 YouTube 페이지에서 일일이 버튼을 클릭하며 자막을
      추가할 필요가 없도록 본 서비스에서 하나의 버튼을 클릭하면 자동으로
      커뮤니티에서 제작한 자막을 올려드리는 서비스를 제공하고 있습니다.
    </p>
    <p>
      이를 위해서 로그인 시 Google 계정에서 <b>토큰 정보</b>를 취득하게 됩니다.
      토큰 정보란 Google 계정 비밀번호 대신 사용하는 문자로, Google 서비스의
      한정된 정보 (본 서비스에서는 YouTube 서비스) 에만 접근할 수 있도록
      Google에서 서비스 제공자에게 발급하는 것을 의미합니다.
      <br></br>
      <br></br>
      기본적으로 토큰은 발급 1시간 뒤에 자동으로 만료되며, 사이트에서 탈퇴 혹은{' '}
      <Link href='https://myaccount.google.com/permissions'>
        Google 계정 관리 페이지
      </Link>
      에서 권한을 취소할 때 즉시 효력을 잃습니다.
      <br></br>
      <br></br>
      토큰의 사용 : 토큰 정보는 YouTube API에 접근하여 YouTube 영상 제목, 설명
      번역 추가 및 자막 파일 업로드를 하기 위한 용도로 사용되며 그 이외의
      용도로는 절대 사용되지 않습니다.
      <br></br>
      토큰의 저장 : 토큰 정보는 서버 데이터베이스에 저장되지 않으며, 사용자
      브라우저의 &quot;쿠키&quot;라고 불리는 저장소에 암호화된 상태로 존재하게
      됩니다. 암호화 상태 이전의 데이터는 오직 암호화 키를 가지고 있는 서버만
      읽을 수 있습니다.
      <br></br>
      토큰의 범위 : 계정 페이지 및 권한 요청 팝업에서 권한 부여를 하지 않는 한
      사이트에서 YouTube 계정에 접근할 수 없습니다. 단, 사용자가 계정 페이지 및
      권한 요청 팝업에서 권한 부여를 할 경우 YouTube 계정에 대한 접근 권한이
      생깁니다.<br></br>
      <b>
        주의: 토큰 권한 자체에는 영상을 업로드하고, 삭제하는 등의 계정 관리
        권한이 포함되지만, 본 서비스는 번역 서비스 제공 이외의 용도로는 절대
        사용하지 않음을 맹세합니다.
      </b>
      <br></br>
      어떤 YouTube API에 접근하는지 투명하게 공개하기 위하여 사이트 소스 코드를
      공개하고 있으며 사이트 하단의 링크에서 확인할 수 있습니다.
      <br></br>
    </p>
    <br></br>
    <br></br>
    <h2>Google API 서비스 사용자 데이터 정책 준수</h2>
    <p>
      감람스톤은 Google API에서 제공받은 데이터를 사용, 다른 어플리케이션에
      전송하는 모든 행위에 대해서{' '}
      <Link href='https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes'>
        제한 사용 요구사항 (Limited Use requirements)
      </Link>
      을 포함한{' '}
      <Link href='https://developers.google.com/terms/api-services-user-data-policy'>
        Google API 서비스 사용자 데이터 정책 (Google API Services User Data
        Policy)
      </Link>
      을 준수합니다.
    </p>
    <br></br>
    <br></br>
    <h2>YouTube API 정책 준수</h2>
    <p>
      본 서비스에서는 YouTube에 자막을 업로드하기 위해 YouTube API 서비스를
      이용합니다. 해당 서비스를 이용함으로써 사용자는{' '}
      <Link href='https://developers.google.com/youtube/terms/api-services-terms-of-service'>
        YouTube 서비스 정책 (YouTube Terms of Service)
      </Link>{' '}
      및{' '}
      <Link href='https://policies.google.com/privacy'>
        Google 개인정보 처리방침 (Google Privacy Policy)
      </Link>
      에 동의하는 것으로 간주됩니다.
      <br></br>또한, 본 사이트에서는 상기 정책과{' '}
      <Link href='https://developers.google.com/youtube/terms/developer-policies'>
        YouTube API 개발자 정책 (YouTube API Developer Policy)
      </Link>{' '}
      을 준수합니다.
    </p>
    <br></br>
    <br></br>
    <h2>사용자의 데이터가 YouTube에서 사용되는 방법</h2>
    <p>
      본 서비스에서는 YouTube에 자막을 업로드하기 위해 사용자 데이터의 일부를
      수집하여 YouTube API에 전송하고 있습니다.<br></br>
      YouTube API에 전송하는 데이터는 영상 제목, 영상 세부 정보, 영상 자막 파일
      및 계정 인증을 위한 사용자 토큰이 있습니다.<br></br>
      <br></br>
      전송된 데이터는 YouTube 내 자막 처리 및 인증 처리를 위해 사용되며, 위에서
      언급된 이외의 데이터는 절대 전송하지 않습니다.
    </p>
  </div>
)

const English = (
  <div className={classes(pageStyles.contents, styles.privacy)}></div>
)

const Privacy: NextPage = () => {
  const [language, setLanguage] = useState<number>(0)
  const languages = [Korean, English]

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
        <div className={classes(pageStyles.contents, styles.privacyLanguages)}>
          Read In Other Language:
          <Button onClick={() => setLanguage(0)}>한국어</Button>
          <Button onClick={() => setLanguage(1)}>English</Button>
        </div>
        {languages[language]}
      </div>
      <Footer></Footer>
    </div>
  )
}

export default Privacy
