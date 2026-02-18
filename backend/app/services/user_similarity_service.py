import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.models.registration_model import Registration
from app.models.user_model import User


def get_similar_users(current_user_id):

    registrations = Registration.query.all()

    if not registrations:
        return []

    user_ids = list(set(r.user_id for r in registrations))
    hackathon_ids = list(set(r.hackathon_id for r in registrations))

    user_index = {user_id: i for i, user_id in enumerate(user_ids)}
    hack_index = {hack_id: i for i, hack_id in enumerate(hackathon_ids)}

    matrix = np.zeros((len(user_ids), len(hackathon_ids)))

    for r in registrations:
        matrix[user_index[r.user_id]][hack_index[r.hackathon_id]] = 1

    current_user_id = int(current_user_id)

    print("Current user:", current_user_id)
    print("User IDs:", user_ids)
    print("Matrix:\n", matrix)

    similarity_matrix = cosine_similarity(matrix)

    current_index = user_index.get(current_user_id)

    if current_index is None:
        print("User not found in matrix!")
        return []

    similarities = similarity_matrix[current_index]

    similar_users = []

    for i, score in enumerate(similarities):
        if user_ids[i] != current_user_id and score > 0:
            user = User.query.get(user_ids[i])
            similar_users.append({
                "user_id": user.id,
                "username": user.username,
                "similarity_score": round(float(score), 3)
            })

    similar_users.sort(key=lambda x: x["similarity_score"], reverse=True)

    return similar_users

