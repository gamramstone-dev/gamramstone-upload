import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import pageStyles from '../styles/page.module.scss'
import styles from '../styles/pages/Administration.module.scss'
import { classes } from '../utils/string'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Footer from '../components/Footer'
import useSWR from 'swr'
import { APIResponse } from '../structs/api'
import { Button } from '../components/Button'
import { useCallback } from 'react'
import { UserState } from '../structs/user'
import toast from 'react-hot-toast'

const fetchList = async (url: string) =>
  fetch(url)
    .then(res => (res.json() as unknown) as APIResponse<string[]>)
    .then(v => {
      if (v.status === 'error') {
        throw new Error(v.message)
      }

      return v.data
    })

const Account: NextPage = () => {
  const router = useRouter()

  useSession({
    required: true,
    onUnauthenticated: () => {
      router.replace('/')
    },
  })

  const { data: users, error } = useSWR(`/api/user/admin/list`, fetchList)

  const updatePermission = useCallback(
    (uuid: string, permission: UserState) => {
      if (
        !confirm(
          `Are you sure to change ${uuid}'s permission to ${permission}?`
        )
      ) {
        return
      }

      fetch(`/api/user/admin/update?uuid=${uuid}&permission=${permission}`)
        .then(v => v.json())
        .then(v => {
          if (v.status === 'error') {
            throw new Error(v.message)
          }

          return v
        })
        .catch(e => {
          toast.error(`Failed to update user permission: ${e.message}`)
        })
    },
    []
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>계정 관리 - 감람스톤</title>
      </Head>
      <div className={pageStyles.page}>
        <div className={classes(pageStyles.contents, styles.heading)}>
          <div className={styles.inner}>
            <span>Administration</span>
          </div>
        </div>

        <div className={classes(pageStyles.contents, styles.grid)}>
          <h2>Users</h2>

          <div className={styles.users}>
            {error ? (
              <p>Error occurred while fetching user lists.</p>
            ) : (
              users
                ?.sort((a, b) => a.localeCompare(b))
                .map(uuid => (
                  <div key={uuid} className={styles.user}>
                    <span className={styles.uuid}>{uuid}</span>
                    <div className={styles.actions}>
                      <Button onClick={() => updatePermission(uuid, 'banned')}>
                        Ban
                      </Button>
                      <Button onClick={() => updatePermission(uuid, 'creator')}>
                        Creator
                      </Button>
                      <Button
                        onClick={() => updatePermission(uuid, 'translator')}
                      >
                        Translator
                      </Button>
                      <Button onClick={() => updatePermission(uuid, 'guest')}>
                        Guest
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      session: await getSession(ctx),
    },
  }
}

export default Account
