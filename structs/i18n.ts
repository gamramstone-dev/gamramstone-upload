import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      gamramstone: 'Gamramstone',
      project_title: 'ISEGYE IDOL - WAKTAVERSE Translation Project',
      tracks: {
        uploaded: '{{counts, number}} Tracks uploaded',
        waiting: '{{counts, number}} Tracks waiting for upload',
        loading: 'Loading... Hang tight!'
      },
      error: 'Error',
      loading: 'Loading...',
      continue: 'Continue',
      cancel: 'Cancel',
      retry: 'Retry',
      close: 'Close',
      run_like_dog: 'Go ahead',
      tabs: {
        waiting: 'Waiting',
        done: 'Uploaded',
        ongoing: 'Translating'
      },
      empty_videos: 'No waiting videos!',
      channel_seo:
        "ISEGYE IDOL, WAKTAVERSE Translation Project - {{channel, string}} channel's translation page",
      sign_in: 'Sign in',
      sign_in_warning:
        'Click OK to sign in with your Google account. If you are logging in for the first time, your email may be exposed to the screen, so please act with caution.',
      profile_image: 'Profile image',
      page_not_found: 'Page not found',
      unsupported_browser:
        "This browser doesn't support the feature. Please run it on Chrome.",
      download_ongoing: 'Downloading {{filename, string}}...',
      download_done: 'Downloaded {{filename, string}}!',

      translation_in_progress: 'Translation in progress...',
      apply_all: 'Apply all automatically',

      languages: {
        aa: '아파르어',
        ab: '압하스어',
        ae: '아베스타어',
        af: 'Afrikaans',
        ak: 'Akan',
        am: 'Amharic',
        an: 'Argonian',
        ar: 'Arabic',
        as: 'Assamese',
        av: 'Avaric',
        ay: 'Aymar',
        az: 'Azerbaijani',
        ba: 'Bashkir',
        be: 'Belarusian',
        bg: 'Bulgarian',
        bh: 'Bihari',
        bi: 'Bislama',
        bm: 'Bambara',
        bn: 'Bengali',
        bo: 'Tibetan',
        br: 'Breton',
        bs: 'Bosnian',
        ca: 'Catalan',
        ce: 'Chechen',
        ch: 'Chamorro',
        co: 'Corsican',
        cr: 'Cree',
        cs: 'Czech',
        cu: 'Church Slavic',
        cv: 'Katuma',
        cy: 'Welsh',
        da: 'Danish',
        de: 'Deutsch',
        dv: 'Divehi',
        dz: 'Dzongkha',
        ee: 'Eware',
        el: 'Modern greek',
        en: 'English',
        eo: 'Esperanto',
        es: 'Spanish',
        et: 'Estonian',
        eu: 'Basque',
        fa: 'Persian',
        ff: 'Fula',
        fi: 'Finnish',
        fj: 'Fijian',
        fo: 'Faroese',
        fr: 'Français',
        fy: '프리지아어',
        ga: 'Irish',
        gd: 'Scottish Gaelic',
        gl: 'Galician',
        gn: 'Guarani',
        gu: 'Gujarati',
        gv: 'man',
        ha: 'Hausa',
        he: 'Hebrew',
        hi: 'Hindi',
        ho: '히로무어',
        hr: '크로아티아어',
        ht: '아이티크리올어',
        hu: 'Hungarian',
        hy: '아르메니아어',
        hz: '헤레로어',
        ia: '인터링구아',
        id: 'Indonesian',
        ie: '인터링구어',
        ig: '이그보어',
        ii: '쓰촨 이어',
        ik: '이누피아크어',
        io: 'Ido',
        is: 'Icelandic',
        it: 'Italiano',
        iu: '이누이트어',
        ja: 'Japanese',
        jv: 'Javanese',
        ka: 'Georgian',
        kg: 'Congo',
        ki: 'Kiku English',
        kj: 'Kwanama',
        kk: 'Kazakh',
        kl: 'Greenlandic',
        km: 'Khmer',
        kn: 'Kannada',
        ko: 'Korean',
        kr: 'Kanuri',
        ks: 'Kashmir',
        ku: 'Kurdish',
        kv: 'Permian',
        kw: 'Cornish',
        ky: 'Kyrgyz',
        la: 'Latin',
        lb: 'Luxembourgish',
        lg: 'Luganda',
        li: 'Limburg',
        ln: 'Lingala',
        lo: 'Lao',
        lt: 'Lithuanian',
        lu: 'Rubakatanga',
        lv: 'Latvian',
        mg: 'Madagascar',
        mh: 'Marshall',
        mi: 'Maori',
        mk: 'Macedonian',
        ml: 'malayalam',
        mn: 'Mongolian',
        mr: '마라타어',
        ms: '말레이어',
        mt: '몰타어',
        my: '미얀마어',
        na: '나우루어',
        nb: '노르웨이어',
        nd: '은데벨레어',
        ne: '네팔어',
        ng: '느동가어',
        nl: 'Dutch',
        nn: 'Nynorsk',
        no: 'Norwegian',
        nr: 'Nrebele',
        nv: 'Navajo',
        ny: 'Chewa',
        oc: 'Provence',
        oj: 'Ojibwa',
        om: 'Oromo',
        or: 'Oriya',
        os: 'Ossetian',
        pa: 'Punjabi',
        pi: 'Pali',
        pl: 'Polish',
        ps: 'Pashtun',
        pt: 'Portuguese',
        qu: '케추아어',
        rm: '레토로망스어',
        rn: '룬디어',
        ro: '루마니아어',
        ru: 'Russian',
        rw: '르완다어',
        sa: '산스크리트어',
        sc: '사르데냐어',
        sd: '신드어',
        se: '북사미어',
        sg: '상고어',
        si: '싱할라어',
        sk: '슬로바키아어',
        sl: '슬로베니아어',
        sm: '사모아어',
        sn: '쇼나어',
        so: '소말리어',
        sq: '알바니아어',
        sr: '세르비아어',
        ss: '스와티어',
        st: '남소토어',
        su: '순다어',
        sv: 'Swedish',
        sw: 'Swahili',
        ta: 'Tamil',
        te: 'Telugu',
        tg: 'Tajik',
        th: 'Thai',
        ti: 'Tigrinya',
        tk: 'Turkmen',
        tl: 'tagalog',
        tn: 'Tswana',
        to: 'Tongan',
        tr: 'Turkish',
        ts: '총가어',
        tt: '타타르어',
        tw: '트위어',
        ty: '타이티어',
        ug: '위구르어',
        uk: 'Ukrainian',
        ur: '우르두어',
        uz: '우즈베크어',
        ve: '벤다어',
        vi: 'Vietnamese',
        vo: '볼라퓌크',
        wa: '왈론어',
        wo: '월로프어',
        xh: '코사어',
        yi: '이디시어',
        yo: '요루바어',
        za: '주앙어',
        zh: 'Chinese',
        zu: '줄주어',
        'en-US': 'English (USA)',
        'en-GB': 'English (UK)'
      },

      cards: {
        tasks: 'Tasks',
        subtitle_manual_apply: 'Apply manually',
        subtitle_automatic_apply: 'Apply automatically',
        open_in_youtube: 'Open in YouTube',
        open_in_workspace: 'Open in Workspace',
        status: 'Status',
        subtitle_files: 'Subtitle files',
        right_click_to_preview:
          'You can preview the subtitle file by right-clicking on it.',
        no_subtitles: 'No subtitles',
        title: 'Title',
        description: 'Description',
        no_data: 'No data'
      },

      settings: {
        darkmode: 'Dark mode',
        darkmode_description: 'Enable dark mode'
      },

      userStates: {
        admin: 'Admin',
        banned: 'Banned',
        creator: 'YouTube Creator',
        guest: 'Guest',
        translator: 'Translator'
      },

      workStatus: {
        done: 'Upload Done',
        none: 'Not Translating',
        waiting: 'Waiting Upload',
        reupload: 'Waiting Reupload',
        wip: 'On Translation'
      },

      manage_account: 'Account management',
      sign_out: 'Sign out',
      sign_out_description: 'Sign out of the site.',

      link_account: 'Link account',
      remove_account: 'Remove account',
      remove_account_description: 'Remove account from the site.',
      remove_account_currently: 'Currently, you are {{userState, string}}.',

      removing_account: 'Removing account...',
      failed_to_remove_account:
        'Failed to remove account, please contact gamramstone@wesub.io for help.',

      last_login: 'Last login',
      go_site_management: 'Go to site management',

      cannot_preview_ytt: 'Previewing for YTT subtitles are not supported yet.',

      console_warn: 'Wait! Big Hacking~',
      console_warn_description:
        "DON'T TYPE ANYTHING IN THIS SCREEN UNLESS YOU ARE SURE ABOUT WHAT YOU ARE DOING.\nDon't do anything someone asks you to. Even they requesting earnestly!",

      popup: {
        bottom_warning:
          'Your email may be exposed when you log in for the first time. Please hide the broadcast screen for a while before pressing the button.',
        link: 'Link',
        link_title:
          'To upload subtitles, you need to link with the YouTube account.',

        sign_in_title: 'How would you like to sign in?',
        sign_in_title_elevated: 'How would you like to connect with?',

        sign_in_description:
          '다중 계정을 사용하시는 왁굳 님은 오른쪽을, 이세돌 분들은 왼쪽을 골라주세요.'
      },

      auto_select: 'Account auto-select',
      manual_select: 'Account manual-select',
    }
  },
  ko: {
    translation: {
      gamramstone: '감람스톤',
      project_title: '이세돌 - 왁타버스 번역 프로젝트',
      tracks: {
        uploaded: '{{counts, number}}개 트랙 업로드 완료',
        waiting: '{{counts, number}}개 트랙 업로드 대기 중',
        loading: '로딩 중이에요... 꽉 잡아요!'
      },
      error: '오류',
      loading: '로딩 중...',
      continue: '계속하기',
      cancel: '취소',
      retry: '재시도',
      close: '닫기',
      run_like_dog: '개같이 시작',
      tabs: {
        waiting: '업로드 대기',
        done: '업로드 완료',
        ongoing: '번역 진행 중'
      },
      empty_videos: '대기 중인 영상이 없어요!',
      channel_seo:
        '이세돌, 왁타버스 번역 프로젝트 - {{channel, string}} 채널의 번역 페이지입니다.',
      sign_in: '로그인',
      sign_in_warning:
        'Google 계정으로 로그인합니다. 처음 로그인 시 이메일이 노출될 수 있으니 잠시 방송 화면을 가려주세요.',
      profile_image: '프로필 이미지',
      page_not_found: '페이지를 찾을 수 없습니다.',
      unsupported_browser:
        '이 브라우저는 기능을 지원하지 않아요. 크롬에서 실행해주세요.',
      download_ongoing: '{{filename, string}} 다운로드 중...',
      download_done: '{{filename, string}} 다운로드 완료!',

      translation_in_progress: '현재 자막 제작 중입니다...',
      apply_all: '전체 자동 적용',

      languages: {
        aa: '아파르어',
        ab: '압하스어',
        ae: '아베스타어',
        af: '아프리칸스어',
        ak: '아칸어',
        am: '암하라어',
        an: '아르곤어',
        ar: '아랍어',
        as: '아샘어',
        av: '아바릭어',
        ay: '아이마어',
        az: '아제르바이잔어',
        ba: '바슈키르어',
        be: '벨라루스어',
        bg: '불가리아어',
        bh: '비하리어',
        bi: '비슬라마어',
        bm: '밤바라어',
        bn: '벵골어',
        bo: '티베트어',
        br: '브르타뉴어',
        bs: '보스니아어',
        ca: '카탈루냐어',
        ce: '체첸어',
        ch: '차모로어',
        co: '코르시카어',
        cr: '크리어',
        cs: '체코어',
        cu: '교회 슬라브어',
        cv: '카투마어',
        cy: '웨일스어',
        da: '덴마크어',
        de: '독일어',
        dv: '디베히어',
        dz: '종카어',
        ee: '에웨어',
        el: '현대 그리스어',
        en: '영어',
        eo: '에스페란토',
        es: '스페인어',
        et: '에스토니아어',
        eu: '바스크어',
        fa: '페르시아어',
        ff: '풀라어',
        fi: '핀란드어',
        fj: '피지어',
        fo: '페로어',
        fr: '프랑스어',
        fy: '프리지아어',
        ga: '아일랜드어',
        gd: '스코틀랜드 게일어',
        gl: '갈리시아어',
        gn: '과라니어',
        gu: '구자라티어',
        gv: '맨어',
        ha: '하우사어',
        he: '히브리어',
        hi: '힌디어',
        ho: '히로무어',
        hr: '크로아티아어',
        ht: '아이티크리올어',
        hu: '헝가리어',
        hy: '아르메니아어',
        hz: '헤레로어',
        ia: '인터링구아',
        id: '인도네시아어',
        ie: '인터링구어',
        ig: '이그보어',
        ii: '쓰촨 이어',
        ik: '이누피아크어',
        io: '이도',
        is: '아이슬란드어',
        it: '이탈리아어',
        iu: '이누이트어',
        ja: '일본어',
        jv: '자바어',
        ka: '그루지야어',
        kg: '콩고어',
        ki: '키쿠유어',
        kj: '콰냐마어',
        kk: '카자흐어',
        kl: '그린란드어',
        km: '크메르어 ',
        kn: '칸나다어',
        ko: '한국어',
        kr: '카누리어',
        ks: '카슈미르어',
        ku: '쿠르드어',
        kv: '페름어',
        kw: '콘월어',
        ky: '키르기스어',
        la: '라틴어',
        lb: '룩셈부르크어',
        lg: '간다어',
        li: '림뷔르흐어',
        ln: '링갈라어',
        lo: '라오어',
        lt: '리투아니아어',
        lu: '루바카탕가어',
        lv: '라트비아어',
        mg: '마다가스카르어',
        mh: '마셜어',
        mi: '마오리어',
        mk: '마케도니아어',
        ml: '말라얄람어',
        mn: '몽골어',
        mr: '마라타어',
        ms: '말레이어',
        mt: '몰타어',
        my: '미얀마어',
        na: '나우루어',
        nb: '노르웨이어',
        nd: '은데벨레어',
        ne: '네팔어',
        ng: '느동가어',
        nl: '네덜란드어',
        nn: '뉘노르스크어',
        no: '노르웨이어',
        nr: '남은데벨레어',
        nv: '나바호어',
        ny: '체와어',
        oc: '프로방스어',
        oj: '오지브와어',
        om: '오로모어',
        or: '오리야어',
        os: '오세트어',
        pa: '펀자브어',
        pi: '팔리어',
        pl: '폴란드어',
        ps: '파슈툰어',
        pt: '포르투갈어',
        qu: '케추아어',
        rm: '레토로망스어',
        rn: '룬디어',
        ro: '루마니아어',
        ru: '러시아어',
        rw: '르완다어',
        sa: '산스크리트어',
        sc: '사르데냐어',
        sd: '신드어',
        se: '북사미어',
        sg: '상고어',
        si: '싱할라어',
        sk: '슬로바키아어',
        sl: '슬로베니아어',
        sm: '사모아어',
        sn: '쇼나어',
        so: '소말리어',
        sq: '알바니아어',
        sr: '세르비아어',
        ss: '스와티어',
        st: '남소토어',
        su: '순다어',
        sv: '스웨덴어',
        sw: '스와힐리어',
        ta: '타밀어',
        te: '텔루구어',
        tg: '타지크어',
        th: '태국어',
        ti: '티그리냐어',
        tk: '투르크멘어',
        tl: '타갈로그',
        tn: '츠와나어',
        to: '통가어',
        tr: '터키어',
        ts: '총가어',
        tt: '타타르어',
        tw: '트위어',
        ty: '타이티어',
        ug: '위구르어',
        uk: '우크라이나어',
        ur: '우르두어',
        uz: '우즈베크어',
        ve: '벤다어',
        vi: '베트남어',
        vo: '볼라퓌크',
        wa: '왈론어',
        wo: '월로프어',
        xh: '코사어',
        yi: '이디시어',
        yo: '요루바어',
        za: '주앙어',
        zh: '중국어',
        zu: '줄주어',
        'en-US': '영어 (미국)',
        'en-GB': '영어 (영국)'
      },

      cards: {
        tasks: '작업',
        subtitle_manual_apply: '자막 수동 적용',
        subtitle_automatic_apply: '자막 자동 적용',
        open_in_youtube: 'Youtube에서 열기',
        open_in_workspace: 'Workspace에서 열기',
        status: '상태',
        subtitle_files: '자막 파일',
        right_click_to_preview: '오른쪽 클릭하여 미리볼 수 있어요.',
        no_subtitles: '자막 파일 없음',
        title: '제목',
        description: '세부 정보',
        no_data: '무슨 일인지 데이터가 없네요...'
      },

      settings: {
        darkmode: '어둠의 자식 모드',
        darkmode_description: '어둠의 자식 모드를 활성화 합니다.'
      },

      userStates: {
        admin: '관리자',
        banned: '차단',
        creator: 'YouTube 크리에이터',
        guest: '방문자',
        translator: '번역가'
      },

      workStatus: {
        done: '업로드 완료',
        none: '자막 작업 안함',
        waiting: '업로드 대기',
        reupload: '재업로드 대기',
        wip: '번역 진행 중'
      },

      manage_account: '계정 관리',
      sign_out: '로그아웃',
      sign_out_description: '사이트에서 로그아웃 합니다.',

      link_account: '계정 연동하기',
      remove_account: '계정 삭제하기',
      remove_account_description: '사이트에서 계정을 삭제합니다.',
      remove_account_currently: '현재 {{userState, string}} 계정입니다.',

      removing_account: '계정 삭제 중...',
      failed_to_remove_account:
        '계정 삭제 실패, gamramstone@wesub.io로 문의하세요.',

      last_login: '마지막 로그인',
      go_site_management: '사이트 관리하러 가기',

      cannot_preview_ytt: 'ytt 형식의 자막은 미리볼 수 없어요.',

      console_warn: '잠깐! 왕해킹사건~',
      console_warn_description:
        '이 창에 절대 아무 것도 입력하지 마시고\n누군가 시키는 일 (어느 탭을 보여달라) 등을 하지마세요. 간절히 요청하더라도요!',

      popup: {
        bottom_warning:
          '구글 로그인 과정에서 이메일이 보일 수 있어요. 로그인 중에는 잠시 방송 화면을 가려주세요.',
        link: '연동하기',
        link_title: '업로드하려면 YouTube 연동이 필요해요.',

        sign_in_title: '어떻게 로그인하시겠어요?',
        sign_in_title_elevated: '어떻게 연동하시겠어요?',

        sign_in_description:
          '다중 계정을 사용하시는 왁굳 님은 오른쪽을, 이세돌 분들은 왼쪽을 골라주세요.'
      },

      auto_select: '계정 자동 선택',
      manual_select: '계정 수동 선택'
    }
  }
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'ko',
    // lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false
    }
  })

export default i18n
