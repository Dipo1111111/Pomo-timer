import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl p-8 sm:p-10">
        <h1 className="text-2xl font-bold text-[#632228] mb-1">Privacy Policy</h1>
        <p className="text-sm text-[#6B6560] mb-6">
          <strong>Pomodoro Timer</strong> — Last updated: July 30, 2026
        </p>

        <p className="text-sm text-[#3D3935] mb-4">
          Pomodoro Timer ("we", "our", or "the app") is a simple focus-timer tool.
          This policy explains how we handle your information when you use our app.
          By using Pomodoro Timer, you agree to the practices described here.
        </p>

        <Section title="1. Information We Collect">
          <p>
            <strong>We collect no personal information.</strong> The app does not collect,
            store, or transmit any names, email addresses, device IDs, location data, or
            any other personal identifiers.
          </p>
          <p className="mt-2">
            The only data stored is your <strong>timer settings</strong> (focus/break durations,
            session count) and <strong>local usage history</strong> (completed sessions per day).
            This data never leaves your device.
          </p>
        </Section>

        <Section title="2. Collection Methods">
          <p>
            All data is stored locally on your device using local storage. No cookies,
            tracking scripts, or analytics SDKs are used. The app does not employ any
            automatic data-collection tools.
          </p>
        </Section>

        <Section title="3. Use of Data">
          <p>
            Locally stored data is used only to run core functionality — displaying your
            timer durations, tracking session history, and remembering preferences.
          </p>
        </Section>

        <Section title="4. Data Sharing">
          <p>
            <strong>We do not share any data with third parties.</strong> No backend server,
            no analytics provider, no advertising network, no cloud storage. All data
            remains exclusively on your device.
          </p>
        </Section>

        <Section title="5. User Rights">
          <p>
            Because no personal data is collected by us, there is nothing to view, update,
            or delete from our side. You may clear the app's local data at any time through
            your device settings (Settings → Apps → Pomodoro Timer → Storage → Clear Data).
          </p>
        </Section>

        <Section title="6. Data Security">
          <p>
            No data is transmitted or stored on any server, so there is no risk of
            server-side breach. Local data is protected by your device's operating
            system security.
          </p>
        </Section>

        <Section title="7. Children's Privacy">
          <p>
            The app does not target children under 13 and does not knowingly collect
            personal information from children. If you believe a child has provided
            personal data through the app, please contact us.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>Email: <strong>skyletlabs@gmail.com</strong></p>
        </Section>

        <Section title="9. Policy Updates">
          <p>
            If this policy changes, the "Last updated" date will be updated. You will
            be notified of material changes through an in-app notice on next launch.
          </p>
        </Section>

        <div className="mt-8 pt-6 border-t border-[#D9CFC0] text-sm text-[#6B6560] flex justify-between items-center">
          <span>&copy; 2026 Pomodoro Timer</span>
          <Link to="/" className="text-[#632228] hover:underline">Back to Timer</Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-[#3D3935] mb-1.5">{title}</h2>
      <div className="text-sm text-[#3D3935] leading-relaxed">{children}</div>
    </div>
  )
}
