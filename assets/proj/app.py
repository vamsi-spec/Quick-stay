import streamlit as st
import pandas as pd
import pickle
import matplotlib.pyplot as plt

# ✅ Load both models
with open('logistic_regression_model.pkl', 'rb') as f:
    lr_model = pickle.load(f)

with open('xgb_model.pkl', 'rb') as f:
    xgb_model = pickle.load(f)

# ✅ App title and description
st.set_page_config(page_title="🌦️ Weather Predictor", layout="wide")

st.title("🌤️ Weather Forecast Predictor")
st.write("""
Upload **today's weather metrics** → choose a model → get predictions for **tomorrow's Tornado Occurrence**.
This demo uses **Logistic Regression** and **XGBoost** trained on your weather dataset.
""")

# ✅ Model selector
model_choice = st.selectbox(
    "Choose a prediction model",
    ("Logistic Regression", "XGBoost")
)

# ✅ Upload input file
uploaded_file = st.file_uploader("Upload today's weather data (.csv)", type=['csv'])

if uploaded_file is not None:
    # Load input
    input_df = pd.read_csv(uploaded_file)
    st.subheader("📋 Uploaded Data Preview")
    st.dataframe(input_df)

    # ✅ Drop non-numeric or unused cols
    input_df_clean = input_df.drop(
        ['Date', 'Location', 'Time', 'Weather Condition'],
        axis=1,
        errors='ignore'
    ).fillna(0)

    # ✅ One-hot encode 'Area'
    if 'Area' in input_df_clean.columns:
        area_dummies = pd.get_dummies(input_df_clean['Area'], prefix='Area')
        input_df_clean = pd.concat([input_df_clean.drop('Area', axis=1), area_dummies], axis=1)

    # ✅ One-hot encode 'Wind Direction'
    if 'Wind Direction' in input_df_clean.columns:
        wind_dummies = pd.get_dummies(input_df_clean['Wind Direction'], prefix='WindDir')
        input_df_clean = pd.concat([input_df_clean.drop('Wind Direction', axis=1), wind_dummies], axis=1)

    # ✅ Pick model
    if model_choice == "Logistic Regression":
        model = lr_model
    else:
        model = xgb_model

    # ✅ Get expected cols
    expected_cols = model.feature_names_in_

    # ✅ Add missing dummy cols
    missing_cols = [col for col in expected_cols if col not in input_df_clean.columns]
    for col in missing_cols:
        input_df_clean[col] = 0

    # ✅ Match training order
    input_df_clean = input_df_clean[expected_cols]

    # ✅ Predict
    prediction = model.predict(input_df_clean)
    input_df['Predicted Tornado Occurrence'] = prediction

    st.subheader("✅ Prediction Result")
    st.dataframe(input_df[['Predicted Tornado Occurrence']])

    tornado_count = input_df['Predicted Tornado Occurrence'].value_counts()

    st.subheader("📊 Tornado Prediction Summary")
    col1, col2 = st.columns(2)

    with col1:
        st.write("**Bar Chart:**")
        st.bar_chart(tornado_count)

    with col2:
        st.write("**Pie Chart:**")
        # ✅ Generate labels dynamically
        labels = []
        for val in tornado_count.index:
            if val == 0:
                labels.append("No Tornado")
            elif val == 1:
                labels.append("Tornado")
            else:
                labels.append(str(val))

        fig1, ax1 = plt.subplots()
        ax1.pie(
            tornado_count,
            labels=labels,
            autopct='%1.1f%%',
            startangle=90
        )
        ax1.axis('equal')
        st.pyplot(fig1)

    st.subheader("🔢 Tornado Occurrence by Row")
    fig2, ax2 = plt.subplots()
    ax2.hist(input_df['Predicted Tornado Occurrence'], bins=[-0.5, 0.5, 1.5], rwidth=0.5)
    ax2.set_xticks([0, 1])
    ax2.set_xlabel('Predicted Tornado Occurrence')
    ax2.set_ylabel('Count')
    st.pyplot(fig2)

    if tornado_count.get(1, 0) > 0:
        st.error("⚠️ Tornado Occurrence detected in prediction!")
    else:
        st.success("✅ No Tornado Occurrence predicted!")

    st.markdown("---")
    st.info("Tip: Try with different weather data and models to see how predictions change.")
