import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

type LinkProps = {
  children: React.ReactNode,
  skipLocaleHandling: boolean,
  href: string,
  locale: string
}

const LinkComponent = (props: LinkProps) => {
  const router = useRouter()
  const locale = props.locale || router.query.locale as string || ''

  let href = props.href || router.asPath
  if (href.indexOf('http') === 0) props.skipLocaleHandling = true
  if (locale && !props.skipLocaleHandling) {
    href = href
      ? `/${locale}${href}`
      : router.pathname.replace('[locale]', locale)
  }

  return (
    <>
      <Link href={href}>
        <a href={props.href}>{props.children}</a>
      </Link>
    </>
  )
}

export default LinkComponent