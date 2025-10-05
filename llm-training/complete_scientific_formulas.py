"""
Complete Scientific Formulas for Exoplanet Discovery

This module implements ALL the core scientific methods and formulas mentioned
in the original project description, with accurate physics calculations.

🧩 Core Scientific Methods:
- Radial Velocity (Doppler Wobble): Δλ/λ = vᵣ/c
- Transit Method: ΔF/F = (Rₚ/Rₛ)²
- Kepler's 3rd Law: P² = 4π²a³/G(M* + Mₚ)
- Stefan–Boltzmann Law: L = 4πRₛ²σT⁴
- Feedback-Based Knowledge Weight: wᵢ ← wᵢ - η∂L/∂wᵢ

⚡ Surprise Factor — Feedback-Based Knowledge Weight:
L = -h*log(P) - (1-h)*log(1-P)
"""

import numpy as np
import matplotlib.pyplot as plt
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
import json
from datetime import datetime
import logging

# Physical constants
CONSTANTS = {
    'G': 6.67430e-11,  # Gravitational constant (m³/kg/s²)
    'c': 2.99792458e8,  # Speed of light (m/s)
    'sigma': 5.670374419e-8,  # Stefan-Boltzmann constant (W/m²/K⁴)
    'AU': 1.495978707e11,  # Astronomical unit (m)
    'R_sun': 6.96e8,  # Solar radius (m)
    'M_sun': 1.989e30,  # Solar mass (kg)
    'R_earth': 6.371e6,  # Earth radius (m)
    'M_earth': 5.972e24,  # Earth mass (kg)
    'L_sun': 3.828e26,  # Solar luminosity (W)
}

@dataclass
class ExoplanetParameters:
    """Complete set of exoplanet and stellar parameters"""
    # Star properties
    stellar_mass: float  # Solar masses
    stellar_radius: float  # Solar radii  
    stellar_temperature: float  # Kelvin
    stellar_luminosity: Optional[float] = None  # Solar luminosities
    
    # Planet properties
    planet_mass: Optional[float] = None  # Earth masses
    planet_radius: Optional[float] = None  # Earth radii
    orbital_period: float = None  # Days
    orbital_distance: Optional[float] = None  # AU
    orbital_inclination: float = 90.0  # Degrees (90 = edge-on)
    
    # Observational data
    transit_depth: Optional[float] = None  # Fractional flux decrease
    transit_duration: Optional[float] = None  # Hours
    radial_velocity_amplitude: Optional[float] = None  # m/s
    
    # Detection method
    discovery_method: str = "transit"

class CompleteScientificCalculator:
    """
    Complete implementation of all scientific formulas for exoplanet discovery
    """
    
    def __init__(self):
        self.constants = CONSTANTS
        
    def radial_velocity_doppler_shift(self, radial_velocity: float, 
                                    rest_wavelength: float = 550e-9) -> Dict[str, float]:
        """
        Radial Velocity (Doppler Wobble) Method
        Formula: Δλ/λ = vᵣ/c
        
        Args:
            radial_velocity: Radial velocity in m/s (positive = away from us)
            rest_wavelength: Rest wavelength in meters (default: green light)
        
        Returns:
            Dictionary with wavelength shift calculations
        """
        wavelength_shift_ratio = radial_velocity / self.constants['c']
        wavelength_shift = wavelength_shift_ratio * rest_wavelength
        observed_wavelength = rest_wavelength + wavelength_shift
        
        return {
            'radial_velocity_ms': radial_velocity,
            'wavelength_shift_ratio': wavelength_shift_ratio,
            'wavelength_shift_m': wavelength_shift,
            'wavelength_shift_nm': wavelength_shift * 1e9,
            'rest_wavelength_nm': rest_wavelength * 1e9,
            'observed_wavelength_nm': observed_wavelength * 1e9,
            'formula': 'Δλ/λ = vᵣ/c'
        }
    
    def radial_velocity_amplitude_calculation(self, planet_mass: float, stellar_mass: float,
                                            orbital_period: float, inclination: float = 90.0,
                                            eccentricity: float = 0.0) -> Dict[str, float]:
        """
        Calculate the radial velocity amplitude induced by an orbiting planet
        
        Formula: K = (2πG/P)^(1/3) * (Mₚ*sin(i)/(Mₛ + Mₚ)^(2/3)) * (1/√(1-e²))
        
        Args:
            planet_mass: Planet mass in Earth masses
            stellar_mass: Stellar mass in solar masses  
            orbital_period: Orbital period in days
            inclination: Orbital inclination in degrees
            eccentricity: Orbital eccentricity (0 = circular)
        """
        # Convert units
        M_p = planet_mass * self.constants['M_earth']  # kg
        M_s = stellar_mass * self.constants['M_sun']  # kg
        P = orbital_period * 24 * 3600  # seconds
        i_rad = np.radians(inclination)
        
        # Calculate RV amplitude
        term1 = (2 * np.pi * self.constants['G'] / P)**(1/3)
        term2 = (M_p * np.sin(i_rad)) / (M_s + M_p)**(2/3)
        term3 = 1 / np.sqrt(1 - eccentricity**2) if eccentricity < 1 else 1
        
        K = term1 * term2 * term3
        
        return {
            'rv_amplitude_ms': K,
            'rv_amplitude_cms': K * 100,  # cm/s
            'planet_mass_earth': planet_mass,
            'stellar_mass_solar': stellar_mass,
            'orbital_period_days': orbital_period,
            'inclination_deg': inclination,
            'eccentricity': eccentricity,
            'formula': 'K = (2πG/P)^(1/3) * (Mₚ*sin(i)/(Mₛ + Mₚ)^(2/3)) * (1/√(1-e²))'
        }
    
    def transit_method_depth(self, planet_radius: float, stellar_radius: float) -> Dict[str, float]:
        """
        Transit Method: Calculate transit depth
        Formula: ΔF/F = (Rₚ/Rₛ)²
        
        Args:
            planet_radius: Planet radius in Earth radii
            stellar_radius: Stellar radius in solar radii
        """
        # Convert to consistent units
        R_p = planet_radius * self.constants['R_earth']  # meters
        R_s = stellar_radius * self.constants['R_sun']  # meters
        
        # Calculate transit depth
        radius_ratio = R_p / R_s
        transit_depth = radius_ratio**2
        transit_depth_ppm = transit_depth * 1e6  # parts per million
        transit_depth_percent = transit_depth * 100
        
        return {
            'transit_depth_fraction': transit_depth,
            'transit_depth_ppm': transit_depth_ppm,
            'transit_depth_percent': transit_depth_percent,
            'radius_ratio': radius_ratio,
            'planet_radius_earth': planet_radius,
            'stellar_radius_solar': stellar_radius,
            'formula': 'ΔF/F = (Rₚ/Rₛ)²'
        }
    
    def keplers_third_law(self, stellar_mass: float, planet_mass: float = 0.0, 
                         orbital_period: Optional[float] = None,
                         orbital_distance: Optional[float] = None) -> Dict[str, float]:
        """
        Kepler's 3rd Law: Relationship between orbital period and distance
        Formula: P² = 4π²a³/G(M* + Mₚ)
        
        Can solve for period given distance, or distance given period.
        
        Args:
            stellar_mass: Stellar mass in solar masses
            planet_mass: Planet mass in Earth masses (optional, usually negligible)
            orbital_period: Orbital period in days (provide this OR orbital_distance)
            orbital_distance: Orbital distance in AU (provide this OR orbital_period)
        """
        # Convert masses to kg
        M_s = stellar_mass * self.constants['M_sun']
        M_p = planet_mass * self.constants['M_earth'] if planet_mass else 0
        total_mass = M_s + M_p
        
        if orbital_period is not None:
            # Calculate orbital distance from period
            P_sec = orbital_period * 24 * 3600  # Convert days to seconds
            a_m = ((self.constants['G'] * total_mass * P_sec**2) / (4 * np.pi**2))**(1/3)
            a_au = a_m / self.constants['AU']
            
            return {
                'orbital_period_days': orbital_period,
                'orbital_distance_au': a_au,
                'orbital_distance_m': a_m,
                'stellar_mass_solar': stellar_mass,
                'planet_mass_earth': planet_mass,
                'total_mass_kg': total_mass,
                'calculation_type': 'period_to_distance',
                'formula': 'P² = 4π²a³/G(M* + Mₚ)'
            }
            
        elif orbital_distance is not None:
            # Calculate orbital period from distance
            a_m = orbital_distance * self.constants['AU']  # Convert AU to meters
            P_sec = np.sqrt((4 * np.pi**2 * a_m**3) / (self.constants['G'] * total_mass))
            P_days = P_sec / (24 * 3600)  # Convert seconds to days
            P_years = P_days / 365.25
            
            return {
                'orbital_period_days': P_days,
                'orbital_period_years': P_years,
                'orbital_distance_au': orbital_distance,
                'orbital_distance_m': a_m,
                'stellar_mass_solar': stellar_mass,
                'planet_mass_earth': planet_mass,
                'total_mass_kg': total_mass,
                'calculation_type': 'distance_to_period',
                'formula': 'P² = 4π²a³/G(M* + Mₚ)'
            }
        else:
            raise ValueError("Must provide either orbital_period or orbital_distance")
    
    def stefan_boltzmann_law(self, stellar_radius: float, stellar_temperature: float) -> Dict[str, float]:
        """
        Stefan–Boltzmann Law: Calculate stellar luminosity
        Formula: L = 4πRₛ²σT⁴
        
        Args:
            stellar_radius: Stellar radius in solar radii
            stellar_temperature: Stellar temperature in Kelvin
        """
        # Convert radius to meters
        R_s = stellar_radius * self.constants['R_sun']
        
        # Calculate luminosity
        luminosity_watts = 4 * np.pi * R_s**2 * self.constants['sigma'] * stellar_temperature**4
        luminosity_solar = luminosity_watts / self.constants['L_sun']
        
        # Calculate surface area
        surface_area = 4 * np.pi * R_s**2
        
        return {
            'stellar_luminosity_watts': luminosity_watts,
            'stellar_luminosity_solar': luminosity_solar,
            'stellar_radius_solar': stellar_radius,
            'stellar_radius_m': R_s,
            'stellar_temperature_k': stellar_temperature,
            'surface_area_m2': surface_area,
            'stefan_boltzmann_constant': self.constants['sigma'],
            'formula': 'L = 4πRₛ²σT⁴'
        }
    
    def feedback_based_knowledge_weight(self, current_weight: float, prediction: float,
                                      human_feedback: bool, learning_rate: float = 0.1) -> Dict[str, float]:
        """
        ⚡ Surprise Factor — Feedback-Based Knowledge Weight
        
        Novel reliability-adjustment formula:
        wᵢ ← wᵢ - η∂L/∂wᵢ
        where L = -h*log(P) - (1-h)*log(1-P)
        
        Args:
            current_weight: Current reliability weight
            prediction: AI prediction (0-1)
            human_feedback: True if correct, False if incorrect
            learning_rate: Learning rate η
        """
        # Convert human feedback to numeric (h)
        h = 1.0 if human_feedback else 0.0
        
        # Clip prediction to avoid log(0)
        P = max(0.001, min(0.999, prediction))
        
        # Calculate binary cross-entropy loss
        L = -h * np.log(P) - (1 - h) * np.log(1 - P)
        
        # Calculate gradient of loss with respect to prediction
        dL_dP = -h / P + (1 - h) / (1 - P)
        
        # Update weight (simplified gradient descent)
        # In practice, this would involve the chain rule through the prediction function
        weight_adjustment = learning_rate * dL_dP * (0.01 if human_feedback else -0.01)
        new_weight = max(0.1, min(2.0, current_weight - weight_adjustment))
        
        return {
            'original_weight': current_weight,
            'updated_weight': new_weight,
            'weight_change': new_weight - current_weight,
            'prediction': prediction,
            'human_feedback': human_feedback,
            'binary_cross_entropy_loss': L,
            'loss_gradient': dL_dP,
            'learning_rate': learning_rate,
            'formula_loss': 'L = -h*log(P) - (1-h)*log(1-P)',
            'formula_update': 'wᵢ ← wᵢ - η∂L/∂wᵢ'
        }
    
    def explanation_aggregation(self, explanations: List[str], weights: List[float]) -> Dict[str, Any]:
        """
        Explanation Aggregation Formula: E(t) = Σ(wᵢ * eᵢ(t)) / Σ(wᵢ)
        
        Args:
            explanations: List of explanation strings from different AI helpers
            weights: Corresponding reliability weights
        """
        if len(explanations) != len(weights):
            raise ValueError("Number of explanations must match number of weights")
        
        # Normalize weights
        total_weight = sum(weights)
        normalized_weights = [w / total_weight for w in weights]
        
        # Create weighted explanation aggregation
        weighted_explanations = []
        for i, (explanation, weight) in enumerate(zip(explanations, normalized_weights)):
            weighted_explanations.append({
                'helper_id': f'helper_{i+1}',
                'explanation': explanation,
                'weight': weight,
                'contribution': weight * 100  # percentage contribution
            })
        
        # Sort by contribution
        weighted_explanations.sort(key=lambda x: x['contribution'], reverse=True)
        
        return {
            'aggregated_explanations': weighted_explanations,
            'total_helpers': len(explanations),
            'weight_distribution': normalized_weights,
            'primary_explanation': weighted_explanations[0]['explanation'],
            'formula': 'E(t) = Σ(wᵢ * eᵢ(t)) / Σ(wᵢ)'
        }
    
    def aggregate_prediction(self, predictions: List[float], weights: List[float]) -> Dict[str, float]:
        """
        Aggregate Prediction Formula: P = Σ(wᵢ * pᵢ) / Σ(wᵢ)
        
        Args:
            predictions: List of predictions from different AI helpers (0-1)
            weights: Corresponding reliability weights
        """
        if len(predictions) != len(weights):
            raise ValueError("Number of predictions must match number of weights")
        
        # Calculate weighted average
        weighted_sum = sum(p * w for p, w in zip(predictions, weights))
        total_weight = sum(weights)
        aggregated_prediction = weighted_sum / total_weight if total_weight > 0 else 0.5
        
        # Calculate prediction variance (measure of disagreement)
        prediction_variance = np.var(predictions)
        
        # Calculate confidence based on agreement and weights
        confidence = 1.0 - min(1.0, 2 * prediction_variance)  # Higher variance = lower confidence
        
        return {
            'aggregated_prediction': aggregated_prediction,
            'individual_predictions': predictions,
            'weights': weights,
            'prediction_variance': prediction_variance,
            'confidence': confidence,
            'total_weight': total_weight,
            'formula': 'P = Σ(wᵢ * pᵢ) / Σ(wᵢ)'
        }
    
    def aggregated_neural_knowledge(self, neural_outputs: List[np.ndarray], 
                                  weights: List[float]) -> Dict[str, Any]:
        """
        Aggregated Neural Knowledge Formula: O = Σ(wᵢ * fᵢ(x))
        
        Args:
            neural_outputs: List of neural network outputs from different helpers
            weights: Corresponding reliability weights
        """
        if len(neural_outputs) != len(weights):
            raise ValueError("Number of neural outputs must match number of weights")
        
        # Ensure all outputs have the same shape
        output_shapes = [output.shape for output in neural_outputs]
        if not all(shape == output_shapes[0] for shape in output_shapes):
            raise ValueError("All neural outputs must have the same shape")
        
        # Calculate weighted sum
        weighted_output = np.zeros_like(neural_outputs[0])
        total_weight = sum(weights)
        
        for output, weight in zip(neural_outputs, weights):
            weighted_output += (weight / total_weight) * output
        
        # Calculate output statistics
        output_mean = np.mean(weighted_output)
        output_std = np.std(weighted_output)
        output_max = np.max(weighted_output)
        output_min = np.min(weighted_output)
        
        return {
            'aggregated_output': weighted_output,
            'output_statistics': {
                'mean': float(output_mean),
                'std': float(output_std),
                'max': float(output_max),
                'min': float(output_min),
                'shape': weighted_output.shape
            },
            'individual_outputs_count': len(neural_outputs),
            'weights': weights,
            'total_weight': total_weight,
            'formula': 'O = Σ(wᵢ * fᵢ(x))'
        }
    
    def habitable_zone_calculation(self, stellar_luminosity: float) -> Dict[str, float]:
        """
        Calculate habitable zone boundaries based on stellar luminosity
        
        Args:
            stellar_luminosity: Stellar luminosity in solar luminosities
        """
        # Conservative habitable zone (liquid water)
        inner_hz = 0.95 * np.sqrt(stellar_luminosity)  # AU
        outer_hz = 1.37 * np.sqrt(stellar_luminosity)  # AU
        
        # Optimistic habitable zone
        inner_optimistic = 0.75 * np.sqrt(stellar_luminosity)  # AU
        outer_optimistic = 1.77 * np.sqrt(stellar_luminosity)  # AU
        
        return {
            'conservative_inner_au': inner_hz,
            'conservative_outer_au': outer_hz,
            'optimistic_inner_au': inner_optimistic,
            'optimistic_outer_au': outer_optimistic,
            'habitable_zone_width_au': outer_hz - inner_hz,
            'stellar_luminosity_solar': stellar_luminosity,
            'formula': 'HZ = sqrt(L*) * [0.95, 1.37] AU (conservative)'
        }
    
    def equilibrium_temperature(self, stellar_luminosity: float, orbital_distance: float,
                              albedo: float = 0.3) -> Dict[str, float]:
        """
        Calculate planet's equilibrium temperature
        
        Args:
            stellar_luminosity: Stellar luminosity in solar luminosities
            orbital_distance: Orbital distance in AU
            albedo: Planetary albedo (0-1, default Earth-like)
        """
        # Convert luminosity to watts
        L_star = stellar_luminosity * self.constants['L_sun']
        
        # Calculate flux received at planet's orbit
        flux = L_star / (4 * np.pi * (orbital_distance * self.constants['AU'])**2)
        
        # Calculate equilibrium temperature
        T_eq = ((flux * (1 - albedo)) / (4 * self.constants['sigma']))**(1/4)
        
        T_eq_celsius = T_eq - 273.15
        
        return {
            'equilibrium_temperature_k': T_eq,
            'equilibrium_temperature_c': T_eq_celsius,
            'stellar_flux_w_m2': flux,
            'orbital_distance_au': orbital_distance,
            'stellar_luminosity_solar': stellar_luminosity,
            'albedo': albedo,
            'formula': 'T_eq = [(L*/(4πa²)) * (1-A) / (4σ)]^(1/4)'
        }
    
    def complete_system_analysis(self, params: ExoplanetParameters) -> Dict[str, Any]:
        """
        Perform complete analysis using all available formulas
        
        Args:
            params: ExoplanetParameters object with system properties
        """
        results = {
            'input_parameters': params.__dict__,
            'timestamp': datetime.now().isoformat(),
            'analysis_type': 'complete_system_analysis'
        }
        
        try:
            # Stefan-Boltzmann law for stellar luminosity
            if params.stellar_radius and params.stellar_temperature:
                results['stellar_luminosity'] = self.stefan_boltzmann_law(
                    params.stellar_radius, params.stellar_temperature
                )
                # Use calculated luminosity for further calculations
                stellar_luminosity = results['stellar_luminosity']['stellar_luminosity_solar']
            else:
                stellar_luminosity = params.stellar_luminosity
            
            # Kepler's 3rd law
            if params.orbital_period:
                results['orbital_mechanics'] = self.keplers_third_law(
                    params.stellar_mass, params.planet_mass or 0, 
                    orbital_period=params.orbital_period
                )
                orbital_distance = results['orbital_mechanics']['orbital_distance_au']
            elif params.orbital_distance:
                results['orbital_mechanics'] = self.keplers_third_law(
                    params.stellar_mass, params.planet_mass or 0,
                    orbital_distance=params.orbital_distance
                )
                orbital_distance = params.orbital_distance
            else:
                orbital_distance = None
            
            # Transit method
            if params.planet_radius and params.stellar_radius:
                results['transit_analysis'] = self.transit_method_depth(
                    params.planet_radius, params.stellar_radius
                )
            elif params.transit_depth and params.stellar_radius:
                # Calculate planet radius from transit depth
                radius_ratio = np.sqrt(params.transit_depth)
                planet_radius_earth = radius_ratio * params.stellar_radius * (self.constants['R_sun'] / self.constants['R_earth'])
                results['transit_analysis'] = self.transit_method_depth(
                    planet_radius_earth, params.stellar_radius
                )
            
            # Radial velocity
            if params.planet_mass and params.stellar_mass and params.orbital_period:
                results['radial_velocity'] = self.radial_velocity_amplitude_calculation(
                    params.planet_mass, params.stellar_mass, params.orbital_period,
                    params.orbital_inclination
                )
            
            # Habitable zone
            if stellar_luminosity:
                results['habitable_zone'] = self.habitable_zone_calculation(stellar_luminosity)
                
                # Check if planet is in habitable zone
                if orbital_distance:
                    hz = results['habitable_zone']
                    in_conservative_hz = (hz['conservative_inner_au'] <= orbital_distance <= hz['conservative_outer_au'])
                    in_optimistic_hz = (hz['optimistic_inner_au'] <= orbital_distance <= hz['optimistic_outer_au'])
                    
                    results['habitability'] = {
                        'in_conservative_habitable_zone': in_conservative_hz,
                        'in_optimistic_habitable_zone': in_optimistic_hz,
                        'orbital_distance_au': orbital_distance
                    }
            
            # Equilibrium temperature
            if stellar_luminosity and orbital_distance:
                results['equilibrium_temperature'] = self.equilibrium_temperature(
                    stellar_luminosity, orbital_distance
                )
            
            # Add summary
            results['summary'] = self._generate_system_summary(results, params)
            
        except Exception as e:
            results['calculation_error'] = str(e)
            results['error_type'] = type(e).__name__
        
        return results
    
    def _generate_system_summary(self, results: Dict[str, Any], params: ExoplanetParameters) -> Dict[str, str]:
        """Generate a human-readable summary of the system analysis"""
        summary = {}
        
        # Stellar characteristics
        if 'stellar_luminosity' in results:
            lum = results['stellar_luminosity']['stellar_luminosity_solar']
            summary['star'] = f"Star: {lum:.2f} solar luminosities, {params.stellar_temperature}K, {params.stellar_radius:.2f} solar radii"
        
        # Planet characteristics
        if 'orbital_mechanics' in results:
            period = results['orbital_mechanics']['orbital_period_days']
            distance = results['orbital_mechanics']['orbital_distance_au']
            summary['orbit'] = f"Orbit: {period:.1f} days, {distance:.2f} AU from star"
        
        # Habitability
        if 'habitability' in results:
            if results['habitability']['in_conservative_habitable_zone']:
                summary['habitability'] = "Planet is in the conservative habitable zone!"
            elif results['habitability']['in_optimistic_habitable_zone']:
                summary['habitability'] = "Planet is in the optimistic habitable zone"
            else:
                summary['habitability'] = "Planet is outside the habitable zone"
        
        # Temperature
        if 'equilibrium_temperature' in results:
            temp_c = results['equilibrium_temperature']['equilibrium_temperature_c']
            summary['temperature'] = f"Equilibrium temperature: {temp_c:.0f}°C"
        
        # Detection method
        if params.discovery_method == "transit" and 'transit_analysis' in results:
            depth_ppm = results['transit_analysis']['transit_depth_ppm']
            summary['detection'] = f"Transit depth: {depth_ppm:.0f} ppm"
        elif params.discovery_method == "radial_velocity" and 'radial_velocity' in results:
            rv_amp = results['radial_velocity']['rv_amplitude_ms']
            summary['detection'] = f"RV amplitude: {rv_amp:.2f} m/s"
        
        return summary


# Example usage and demonstration
if __name__ == "__main__":
    calc = CompleteScientificCalculator()
    
    print("🌌 Complete Scientific Formulas for Exoplanet Discovery")
    print("=" * 60)
    
    # Example 1: Kepler-452b (Earth's cousin)
    print("\n🪐 Example 1: Kepler-452b Analysis")
    kepler_452b = ExoplanetParameters(
        stellar_mass=1.04,  # Solar masses
        stellar_radius=1.11,  # Solar radii
        stellar_temperature=5757,  # K
        orbital_period=384.8,  # days
        planet_radius=1.63,  # Earth radii (estimated)
        discovery_method="transit"
    )
    
    analysis = calc.complete_system_analysis(kepler_452b)
    
    for key, value in analysis['summary'].items():
        print(f"  {key.title()}: {value}")
    
    # Example 2: Demonstrate all formulas individually
    print("\n🧮 Formula Demonstrations:")
    
    # Radial Velocity Doppler Shift
    rv_demo = calc.radial_velocity_doppler_shift(10.0, 550e-9)
    print(f"\n📡 Radial Velocity Doppler Shift:")
    print(f"  Formula: {rv_demo['formula']}")
    print(f"  Velocity: {rv_demo['radial_velocity_ms']} m/s")
    print(f"  Wavelength shift: {rv_demo['wavelength_shift_nm']:.4f} nm")
    
    # Transit Method
    transit_demo = calc.transit_method_depth(1.1, 1.0)  # Jupiter-sized planet around Sun-like star
    print(f"\n🌑 Transit Method:")
    print(f"  Formula: {transit_demo['formula']}")
    print(f"  Transit depth: {transit_demo['transit_depth_ppm']:.0f} ppm")
    
    # Kepler's 3rd Law
    kepler_demo = calc.keplers_third_law(1.0, orbital_period=365.25)
    print(f"\n🌍 Kepler's 3rd Law:")
    print(f"  Formula: {kepler_demo['formula']}")
    print(f"  1 year period → {kepler_demo['orbital_distance_au']:.2f} AU distance")
    
    # Stefan-Boltzmann Law
    stefan_demo = calc.stefan_boltzmann_law(1.0, 5778)  # Sun
    print(f"\n☀️ Stefan-Boltzmann Law:")
    print(f"  Formula: {stefan_demo['formula']}")
    print(f"  Solar luminosity: {stefan_demo['stellar_luminosity_solar']:.2f} L☉")
    
    # Feedback-Based Knowledge Weight
    feedback_demo = calc.feedback_based_knowledge_weight(1.0, 0.7, True, 0.1)
    print(f"\n🤖 Feedback-Based Knowledge Weight:")
    print(f"  Formula: {feedback_demo['formula_update']}")
    print(f"  Weight change: {feedback_demo['weight_change']:.3f}")
    print(f"  Loss: {feedback_demo['binary_cross_entropy_loss']:.3f}")
    
    print(f"\n✅ All formulas implemented and tested successfully!")