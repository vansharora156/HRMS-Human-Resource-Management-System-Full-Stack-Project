"""
Performance module blueprints.
Tables: performance_cycles, goals, reviews, ratings, feedback
"""

from utils import crud_blueprint

performance_cycles_bp = crud_blueprint(
    table_name="performance_cycles",
    primary_key="cycle_id",
    bp_name="performance_cycles",
    url_prefix="/api/performance-cycles",
)

goals_bp = crud_blueprint(
    table_name="goals",
    primary_key="goal_id",
    bp_name="goals",
    url_prefix="/api/goals",
)

reviews_bp = crud_blueprint(
    table_name="reviews",
    primary_key="review_id",
    bp_name="reviews",
    url_prefix="/api/reviews",
)

ratings_bp = crud_blueprint(
    table_name="ratings",
    primary_key="rating_id",
    bp_name="ratings",
    url_prefix="/api/ratings",
)

feedback_bp = crud_blueprint(
    table_name="feedback",
    primary_key="feedback_id",
    bp_name="feedback",
    url_prefix="/api/feedback",
)
