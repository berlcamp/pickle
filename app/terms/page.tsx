'use client'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Tournament Terms & Eligibility Criteria
        </h1>

        <section className="space-y-6 text-gray-800 leading-relaxed">
          {/* NOVICE */}
          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-3">
              NOVICE
            </h2>
            <ol className="list-decimal ml-5 space-y-2">
              <li>
                Players must not have a competitive or recreational background
                in tennis, badminton, table tennis, squash, or any other racquet
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
            </ol>
            <p className="mt-4 text-sm italic text-gray-600">
              The intent of the Novice Category is to provide a welcoming
              environment for true beginners to compete and learn without facing
              experienced or highly skilled players. Any breach of these
              criteria may result in disqualification or reassignment to an
              appropriate category at the discretion of the tournament
              committee.
            </p>
          </div>

          {/* BEGINNER */}
          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-3">
              BEGINNER
            </h2>
            <ol className="list-decimal ml-5 space-y-2">
              <li>
                Players may have previously competed in the Intermediate
                category, but must not have placed in the top 3 (podiumed) in
                those events. Players with any podium finishes in Intermediate
                or higher divisions are not eligible for the Beginner category.
              </li>
              <li>
                <strong>Self-Rating & Skill Assessment:</strong> Players may
                self-rate as Beginners based on their skill level and
                experience. Tournament organizers reserve the right to reassign
                players to a more appropriate division if their skill level is
                deemed too advanced for the Beginner category. Skill assessments
                may be conducted via observation or past performance reviews.
              </li>
            </ol>
          </div>

          {/* INTERMEDIATE */}
          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-3">
              INTERMEDIATE
            </h2>
            <ol className="list-decimal ml-5 space-y-2">
              <li>
                Players must not have podiumed (top 3 finish) in any Open or
                Advanced division events (Provincial to National Level).
              </li>
              <li>
                Players with Advanced-level experience may participate only if
                paired with a Beginner-level partner. This rule is intended to
                balance skill levels within teams and encourage mentorship.
              </li>
              <li>
                <strong>Organizer Discretion:</strong> Tournament organizers
                reserve the right to reassign or disqualify any player or team
                if it is determined that their skill level is above
                Intermediate. Skill evaluations may be based on observation,
                match performance, or prior tournament records.
              </li>
            </ol>
          </div>

          {/* No Sandbagging */}
          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-3">
              No Sandbagging
            </h2>
            <p>
              “Sandbagging” (intentionally playing below one’s skill level) is
              strictly prohibited. Any players found to be sandbagging may be
              disqualified or moved to a higher division at the organizers’
              discretion.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
