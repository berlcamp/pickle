/* eslint-disable react/no-unescaped-entities */
'use client'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Eligibility Criteria
        </h1>

        {/* NOVICE */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-600 mb-3">NOVICE</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              Players must not have a competitive or recreational background in
              tennis, badminton, table tennis, squash, or any other racquet
              sport.
            </li>
            <li>
              Players may have participated in beginner level tournaments.
              However, they must not have placed on the podium (i.e., no 1st,
              2nd, or 3rd place finishes) in any prior pickleball tournament.
            </li>
            <li>
              <strong>Self-Rating Allowed:</strong> Players may self-rate as
              “Novice.” However, tournament organizers reserve the right to
              reclassify any player to a higher category if their skills are
              deemed too advanced for the Novice division (e.g., consistent
              strong play, overpowering less experienced opponents, etc.).
            </li>
          </ul>

          <div className="mt-5 text-gray-700 space-y-3">
            <p>
              <strong>Additional Notes:</strong> The intent of the Novice
              Category is to provide a welcoming environment for true beginners
              to compete and learn without facing experienced or highly skilled
              players.
            </p>
            <p>
              Any breach of these criteria may result in disqualification or
              reassignment to an appropriate category at the discretion of the
              tournament committee.
            </p>
          </div>
        </section>

        {/* BEGINNER */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-600 mb-3">
            BEGINNER
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              Players may have previously competed in the Intermediate category,
              but must not have placed in the top 3 (podiumed) in those events.
              Players with any podium finishes in Intermediate or higher
              divisions are not eligible for the Beginner category.
            </li>
            <li>
              <strong>Self-Rating & Skill Assessment:</strong> Players may
              self-rate as Beginners based on their skill level and experience.
              Tournament organizers reserve the right to reassign players to a
              more appropriate division if their skill level is deemed too
              advanced for the Beginner category. Skill assessments may be
              conducted via observation or past performance reviews.
            </li>
          </ul>
        </section>

        {/* INTERMEDIATE */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-600 mb-3">
            INTERMEDIATE
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              Players must not have podiumed (top 3 finish) in any Open or
              Advanced division events (Provincial to National Level).
            </li>
            <li>
              Players with Advanced-level experience may participate only if
              paired with a Beginner or low intermediate level partner. This
              rule is intended to balance skill levels within teams and
              encourage mentorship.
            </li>
            <li>
              <strong>Organizer Discretion:</strong> Tournament organizers
              reserve the right to reassign or disqualify any player or team if
              it is determined that their skill level is above Intermediate.
              Skill evaluations may be based on observation, match performance,
              or prior tournament records.
            </li>
          </ul>
        </section>

        {/* SANDBAGGING */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-3">
            No Sandbagging
          </h2>
          <p className="text-gray-700">
            “Sandbagging” (intentionally playing below one's skill level) is
            strictly prohibited. Any players found to be sandbagging may be
            disqualified or moved to a higher division at the organizers'
            discretion.
          </p>
        </section>
      </div>
    </div>
  )
}
