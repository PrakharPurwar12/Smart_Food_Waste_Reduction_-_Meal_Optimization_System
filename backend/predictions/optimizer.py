def calculate_food(predicted_students):
    """
    Convert predicted students into food quantity
    """

    # per student consumption (approx values)
    rice_per_student = 0.12   # kg (120g)
    dal_per_student = 0.06    # kg
    chapati_per_student = 2   # pieces

    rice = predicted_students * rice_per_student
    dal = predicted_students * dal_per_student
    chapati = predicted_students * chapati_per_student

    return {
        "rice_kg": round(rice, 2),
        "dal_kg": round(dal, 2),
        "chapati_count": int(chapati)
    }