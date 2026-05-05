import { Route, Switch, Link, useLocation } from "wouter"
import { Camera, Home as HomeIcon, Scale } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-br from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
        Your Mezcal Journey
      </h1>
      <p className="text-muted-foreground">
        Capture, compare, and discover what you actually love.
      </p>
      <Card className="rounded-3xl border-white/40 bg-white/60 backdrop-blur-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">No mezcals yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Tap the camera below to log your first one.
          </p>
          <Link href="/capture">
            <Button className="rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
              Capture a mezcal
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

function Capture() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-br from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
        Capture
      </h1>
      <p className="text-muted-foreground">
        The capture form lives here. Coming Day 5.
      </p>
      <Card className="rounded-3xl border-white/40 bg-white/60 backdrop-blur-md shadow-sm">
        <CardContent className="py-12 text-center text-muted-foreground text-sm">
          Placeholder. Camera, EXIF, GPS, OCR, and the form fields slot in here.
        </CardContent>
      </Card>
    </div>
  )
}

function Compare() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-br from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
        Compare
      </h1>
      <Card className="rounded-3xl border-white/40 bg-white/60 backdrop-blur-md shadow-sm">
        <CardContent className="py-12 text-center text-muted-foreground text-sm">
          Log at least 2 mezcals to start comparing.
        </CardContent>
      </Card>
    </div>
  )
}

function BottomNav() {
  const [location] = useLocation()
  const items = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/capture", label: "Capture", icon: Camera },
    { href: "/compare", label: "Compare", icon: Scale },
  ]
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex gap-1 rounded-full border border-white/40 bg-white/70 p-2 shadow-lg backdrop-blur-xl">
        {items.map(({ href, label, icon: Icon }) => {
          const active = location === href
          return (
            <Link key={href} href={href}>
              <button
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 pb-24 dark:from-purple-950/40 dark:via-background dark:to-fuchsia-950/40">
      <main className="mx-auto max-w-2xl px-6 pt-12">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/capture" component={Capture} />
          <Route path="/compare" component={Compare} />
          <Route>
            <p className="text-center text-muted-foreground">404</p>
          </Route>
        </Switch>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
