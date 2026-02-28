"""
Recruitment module blueprints.
Tables: job_openings, candidates, applications, interviews, offers
"""

from utils import crud_blueprint

job_openings_bp = crud_blueprint(
    table_name="job_openings",
    primary_key="job_id",
    bp_name="job_openings",
    url_prefix="/api/job-openings",
)

candidates_bp = crud_blueprint(
    table_name="candidates",
    primary_key="candidate_id",
    bp_name="candidates",
    url_prefix="/api/candidates",
)

applications_bp = crud_blueprint(
    table_name="applications",
    primary_key="application_id",
    bp_name="applications",
    url_prefix="/api/applications",
)

interviews_bp = crud_blueprint(
    table_name="interviews",
    primary_key="interview_id",
    bp_name="interviews",
    url_prefix="/api/interviews",
)

offers_bp = crud_blueprint(
    table_name="offers",
    primary_key="offer_id",
    bp_name="offers",
    url_prefix="/api/offers",
)
