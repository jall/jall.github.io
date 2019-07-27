import React from "react"
import {graphql} from "gatsby"

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
        description: string
        author: {
          name: string
          url: string
        }
      }
    }
    markdownRemark: {
      html: string
      excerpt: string
      frontmatter: {
        title: string
        date: string
      }
    }
  }
}

export default function BlogPost({data}: Props) {
  const {markdownRemark} = data
  const {frontmatter, html} = markdownRemark

  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{frontmatter.title}</h1>
        <h2>{frontmatter.date}</h2>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{__html: html}}
        />
      </div>
    </div>
  )
}

export const query = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: {path: {eq: $path}}) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
