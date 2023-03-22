import express from 'express'
import request from 'superagent'

import { openAiToken } from '../auth'

const router = express.Router()

const apiUrl = 'https://api.openai.com/v1'

interface Choice {
  message: {
    role: string
    content: string
  }
}

interface ChatCompletion {
  id: string
  created: Date
  model: string
  choices: Choice[]
}

function isChatCompletion(data: any): data is ChatCompletion {
  return 'choices' in data
}

router.get('/', (req, res) => {
  const movieTitle = req.query?.movie
  const actorName = req.query?.actor

  if (!movieTitle || !actorName) {
    res.status(500).json({
      error:
        "You must supply a movie title and actor name in your query, eg: '/quotes/?movie=The Dark Knight&actor=Christian Bale'",
    })

    return
  }

  const requestData = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Give me a quote from ${actorName} in the film ${movieTitle}`,
      },
    ],
  }

  request
    .post(`${apiUrl}/chat/completions`)
    .set('Content-Type', 'application/json')
    .auth(openAiToken, { type: 'bearer' })
    .send(requestData)
    .then((response) => {
      if (
        !isChatCompletion(response.body) ||
        response.body.choices.length < 1
      ) {
        const errorMessage =
          'Could not find quote in the response from chatGPT.'

        console.error(errorMessage, response.body)
        res.status(500).json({
          error: errorMessage,
        })

        return
      }

      const quote = response.body.choices[0].message.content
      res.json({ quote: quote })
    })
    .catch((error) => {
      console.error(error.message)
      res.status(500).json({
        error: (error as Error).message,
      })
    })
})

export default router
