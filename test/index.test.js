import test from 'brittle' // https://github.com/holepunchto/brittle
import joyrider from 'joyrider' // https://github.com/holepunchto/joyrider

const rider = joyrider(import.meta.url)

test('title click', async ({ teardown, is, ok, plan }) => {
  plan(2)
  const ride = await rider({ teardown, app: '..' })

  const inspect = await ride.open()

  const h1 = await inspect.querySelector('h1')

  ok(h1)

  await inspect.click(h1)

  is(await inspect.innerHTML(h1), '🍐')
})
