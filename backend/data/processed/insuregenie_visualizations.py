# Interactive InsureGenie Visualizations
# Save as: insuregenie_visualizations.py
# Install: pip install plotly dash

import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
import dash
from dash import dcc, html, Input, Output

def create_interactive_dashboard(training_df):
    """Create interactive Plotly dashboard"""
    
    # 1. Premium vs Risk Interactive Scatter
    fig_scatter = px.scatter(
        training_df.sample(min(1000, len(training_df))), 
        x='asset_value', 
        y='final_monthly_premium',
        color='composite_risk_score',
        size='months_selected',
        hover_data=['vehicle_make', 'vehicle_model', 'query_type'],
        title='🚗 Vehicle Value vs Premium (Interactive)',
        color_continuous_scale='viridis'
    )
    
    # 2. Premium Distribution by Query Type
    fig_box = px.box(
        training_df, 
        x='query_type', 
        y='final_monthly_premium',
        color='query_type',
        title='💰 Premium Distribution by Query Type'
    )
    fig_box.update_xaxes(tickangle=45)
    
    # 3. Risk Factors Radar Chart
    risk_factors = training_df[['age_risk_factor', 'value_risk_factor', 
                               'brand_risk_factor', 'geo_risk_factor', 
                               'performance_risk_factor']].mean()
    
    fig_radar = go.Figure(data=go.Scatterpolar(
        r=risk_factors.values,
        theta=risk_factors.index,
        fill='toself',
        name='Average Risk Factors'
    ))
    fig_radar.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 2])
        ),
        title="📊 Average Risk Factor Analysis"
    )
    
    # 4. Time Series Premium Trends
    monthly_trends = training_df.groupby('months_selected').agg({
        'final_monthly_premium': 'mean',
        'total_premium': 'mean',
        'discount_rate': 'mean'
    }).reset_index()
    
    fig_trends = make_subplots(
        rows=2, cols=1,
        subplot_titles=('Monthly Premium Trends', 'Discount Rates'),
        vertical_spacing=0.1
    )
    
    fig_trends.add_trace(
        go.Scatter(x=monthly_trends['months_selected'], 
                  y=monthly_trends['final_monthly_premium'],
                  mode='lines+markers', name='Monthly Premium'),
        row=1, col=1
    )
    
    fig_trends.add_trace(
        go.Bar(x=monthly_trends['months_selected'], 
               y=monthly_trends['discount_rate']*100,
               name='Discount Rate %'),
        row=2, col=1
    )
    
    fig_trends.update_layout(title_text="📈 InsureGenie Pricing Trends")
    
    return fig_scatter, fig_box, fig_radar, fig_trends

def create_dash_app(training_df):
    """Create interactive Dash web app"""
    
    app = dash.Dash(__name__)
    
    app.layout = html.Div([
        html.H1("🚀 InsureGenie AI Analytics Dashboard", 
                style={'textAlign': 'center', 'color': '#2c3e50'}),
        
        html.Div([
            html.Div([
                html.Label("Select Query Type:"),
                dcc.Dropdown(
                    id='query-dropdown',
                    options=[{'label': qt, 'value': qt} for qt in training_df['query_type'].unique()],
                    value='quote_request',
                    multi=True
                )
            ], style={'width': '48%', 'display': 'inline-block'}),
            
            html.Div([
                html.Label("Select Term Length:"),
                dcc.Slider(
                    id='term-slider',
                    min=training_df['months_selected'].min(),
                    max=training_df['months_selected'].max(),
                    value=12,
                    marks={str(month): str(month) for month in training_df['months_selected'].unique()},
                    step=None
                )
            ], style={'width': '48%', 'float': 'right', 'display': 'inline-block'})
        ]),
        
        dcc.Graph(id='premium-scatter'),
        dcc.Graph(id='risk-distribution'),
        
        html.Div([
            html.H3("📊 Key Metrics"),
            html.Div(id='metrics-display')
        ])
    ])
    
    @app.callback(
        [Output('premium-scatter', 'figure'),
         Output('risk-distribution', 'figure'),
         Output('metrics-display', 'children')],
        [Input('query-dropdown', 'value'),
         Input('term-slider', 'value')]
    )
    def update_graphs(selected_queries, selected_term):
        # Filter data
        if isinstance(selected_queries, str):
            selected_queries = [selected_queries]
        
        filtered_df = training_df[
            (training_df['query_type'].isin(selected_queries)) &
            (training_df['months_selected'] == selected_term)
        ]
        
        # Update scatter plot
        scatter_fig = px.scatter(
            filtered_df,
            x='asset_value',
            y='final_monthly_premium',
            color='composite_risk_score',
            title=f'Premium vs Value ({selected_term} months)'
        )
        
        # Update risk distribution
        risk_fig = px.histogram(
            filtered_df,
            x='composite_risk_score',
            title='Risk Score Distribution'
        )
        
        # Calculate metrics
        avg_premium = filtered_df['final_monthly_premium'].mean()
        avg_risk = filtered_df['composite_risk_score'].mean()
        total_vehicles = len(filtered_df)
        
        metrics = html.Div([
            html.P(f"Average Premium: £{avg_premium:.2f}"),
            html.P(f"Average Risk Score: {avg_risk:.1f}"),
            html.P(f"Total Vehicles: {total_vehicles:,}")
        ])
        
        return scatter_fig, risk_fig, metrics
    
    return app

if __name__ == '__main__':
    # Load your training data
    training_df = pd.read_csv('insuregenie_training_data.csv')
    
    # Create and run Dash app
    app = create_dash_app(training_df)
    app.run_server(debug=True, port=8050)
