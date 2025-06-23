// File: apps/frontend/components/EndpointTester.tsx
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface Props {
  method: string
  path: string
}

export const EndpointTester = ({ method, path }: Props) => {
  const [requestBody, setRequestBody] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const sendTestRequest = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method !== 'GET' ? requestBody : undefined,
      })

      const contentType = res.headers.get('Content-Type') || ''
      const data =
        contentType.includes('application/json')
          ? JSON.stringify(await res.json(), null, 2)
          : await res.text()

      setResponse(data)
    } catch (err) {
      setResponse('Error: ' + err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-4 mt-4">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">Test: {method} {path}</h2>

        {(method === 'POST' || method === 'PUT') && (
          <div>
            <Label htmlFor="body">Request Body (JSON)</Label>
            <Textarea
              id="body"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              rows={6}
              className="font-mono text-sm"
              placeholder='{"key": "value"}'
            />
          </div>
        )}

        <Button onClick={sendTestRequest} disabled={loading}>
          {loading ? 'Sending...' : 'Send Request'}
        </Button>

        {response && (
          <div>
            <Label>Response</Label>
            <Textarea
              readOnly
              value={response}
              rows={10}
              className="font-mono text-sm bg-gray-100 dark:bg-gray-800"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
