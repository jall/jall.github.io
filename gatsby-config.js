"use strict"

module.exports = {
  siteMetadata: {
    title: "Jon Hall",
    description: "My personal blog",
    keywords: "jon hall, blog",
    siteUrl: "https://www.jall.me",
    author: {
      name: "Jon Hall",
      url: "https://twitter.com/jonnyrhall",
      email: "hello@jall.me",
    },
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "blog",
        path: `${__dirname}/blog`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-responsive-iframe",
            options: {
              wrapperStyle: "margin-bottom: 1rem",
            },
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1140,
              quality: 90,
              linkImagesToOriginal: false,
            },
          },
        ],
      },
    },
    "gatsby-transformer-json",
    {
      resolve: "gatsby-plugin-canonical-urls",
      options: {
        siteUrl: "https://www.jall.me",
      },
    },
    "gatsby-plugin-emotion",
    "gatsby-plugin-typescript",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-netlify-cms",
  ],
}
