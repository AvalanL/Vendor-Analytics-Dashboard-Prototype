import Link from "next/link"

export function PTSTrainingHeader() {
  const pageTitleStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    color: "#1A1C1C",
    fontFamily: "Satoshi, sans-serif",
    fontSize: "34px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "118%",
  }

  const breadcrumbStyle = {
    color: "#5751F9",
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "143%",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationSkipInk: "none",
    textDecorationThickness: "auto",
    textUnderlineOffset: "auto",
    textUnderlinePosition: "from-font",
  }

  const breadcrumbTextStyle = {
    color: "#1A1C1C",
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "143%",
  }


  return (
    <div className="mb-6">
      <div className="mb-2">
        <Link href="/" style={breadcrumbStyle}>
          Karat Internal
        </Link>
        <span style={breadcrumbTextStyle} className="mx-1">
          /
        </span>
        <span style={breadcrumbTextStyle}>PTS Training</span>
      </div>

      <div className="mb-6">
        <h1 style={pageTitleStyle}>
          PTS Internal Training
        </h1>
          <p className="text-gray-600 mt-2" style={{fontFamily: '"Work Sans", sans-serif'}}>
            Internal demo and training materials for Partner Talent Solutions
          </p>
      </div>

    </div>
  )
}
