import streamlit as st
import pandas as pd
import pickle
import matplotlib.pyplot as plt

# ✅ Load all models
with open('logistic_regression_model.pkl', 'rb') as f:
    lr_tornado = pickle.load(f)
with open('xgb_model.pkl', 'rb') as f:
    xgb_tornado = pickle.load(f)

with open('logistic_regression_rain.pkl', 'rb') as f:
    lr_rain = pickle.load(f)
with open('xgb_rain.pkl', 'rb') as f:
    xgb_rain = pickle.load(f)

with open('logistic_regression_wind.pkl', 'rb') as f:
    lr_wind = pickle.load(f)
with open('xgb_wind.pkl', 'rb') as f:
    xgb_wind = pickle.load(f)

# ✅ Page config
st.set_page_config(page_title="🌦️ Weather Predictor", layout="wide")

st.title("🌤️ Weather Forecast Predictor")
st.write("""
Upload **today's weather metrics** → choose a weather type → choose a model → get predictions.
Available predictions:
- 🌪️ Tornado Occurrence  
- 🌧️ Rain Occurrence  
- 💨 Windy Day
""")

# ✅ Select weather target
target_choice = st.selectbox(
    "Select the weather event to predict:",
    ("Tornado Occurrence", "Rain Occurrence", "Windy Day")
)

# ✅ Select model
if target_choice == "Tornado Occurrence":
    model_choice = st.selectbox("Choose model", ("Logistic Regression", "XGBoost"))
    model = lr_tornado if model_choice == "Logistic Regression" else xgb_tornado
elif target_choice == "Rain Occurrence":
    model_choice = st.selectbox("Choose model", ("Logistic Regression", "XGBoost"))
    model = lr_rain if model_choice == "Logistic Regression" else xgb_rain
elif target_choice == "Windy Day":
    model_choice = st.selectbox("Choose model", ("Logistic Regression", "XGBoost"))
    model = lr_wind if model_choice == "Logistic Regression" else xgb_wind

# ✅ Upload CSV
uploaded_file = st.file_uploader("Upload today's weather data (.csv)", type=['csv'])

if uploaded_file is not None:
    input_df = pd.read_csv(uploaded_file)
    st.subheader("📋 Uploaded Data Preview")
    st.dataframe(input_df)

    # ✅ Drop non-numeric columns if they exist
    input_df_clean = input_df.drop(
        ['Date', 'Location', 'Time', 'Weather Condition'],
        axis=1,
        errors='ignore'
    ).fillna(0)

    # ✅ One-hot encode 'Area'
    if 'Area' in input_df_clean.columns:
        area_dummies = pd.get_dummies(input_df_clean['Area'], prefix='Area')
        input_df_clean = pd.concat([input_df_clean.drop('Area', axis=1), area_dummies], axis=1)

    # ✅ One-hot encode 'Wind Direction' if you have it as category
    if 'Wind Direction' in input_df_clean.columns and not pd.api.types.is_numeric_dtype(input_df_clean['Wind Direction']):
        wind_dummies = pd.get_dummies(input_df_clean['Wind Direction'], prefix='WindDir')
        input_df_clean = pd.concat([input_df_clean.drop('Wind Direction', axis=1), wind_dummies], axis=1)

    # ✅ Make sure columns match training
    expected_cols = model.feature_names_in_
    missing_cols = [col for col in expected_cols if col not in input_df_clean.columns]
    for col in missing_cols:
        input_df_clean[col] = 0
    input_df_clean = input_df_clean[expected_cols]

    # ✅ Predict
    prediction = model.predict(input_df_clean)
    input_df['Prediction'] = prediction

    st.subheader("✅ Prediction Result")
    st.dataframe(input_df[['Prediction']])

    prediction_count = input_df['Prediction'].value_counts()

    st.subheader(f"📊 {target_choice} Summary")
    col1, col2 = st.columns(2)

    with col1:
        st.write("**Bar Chart:**")
        st.bar_chart(prediction_count)

    with col2:
        st.write("**Pie Chart:**")
        labels = [f"{target_choice} = {val}" for val in prediction_count.index]
        fig1, ax1 = plt.subplots()
        ax1.pie(prediction_count, labels=labels, autopct='%1.1f%%', startangle=90)
        ax1.axis('equal')
        st.pyplot(fig1)

    st.subheader("🔢 Prediction by Row")
    fig2, ax2 = plt.subplots()
    ax2.hist(input_df['Prediction'], bins=[-0.5, 0.5, 1.5], rwidth=0.5)
    ax2.set_xticks([0, 1])
    ax2.set_xlabel('Prediction')
    ax2.set_ylabel('Count')
    st.pyplot(fig2)

    if prediction_count.get(1, 0) > 0:
        st.error(f"⚠️ {target_choice} detected in prediction!")
    else:
        st.success(f"✅ No {target_choice} predicted!")

    st.markdown("---")
    st.info("Tip: Try different weather data and models to see how predictions change.")
