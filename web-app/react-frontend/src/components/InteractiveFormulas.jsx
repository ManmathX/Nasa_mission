import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calculator, Telescope, Zap, Brain, Globe, Atom } from 'lucide-react';

// Physical constants
const CONSTANTS = {
    G: 6.67430e-11,      // Gravitational constant (m³/kg/s²)
    c: 2.99792458e8,     // Speed of light (m/s)
    sigma: 5.670374419e-8, // Stefan-Boltzmann constant (W/m²/K⁴)
    AU: 1.495978707e11,  // Astronomical unit (m)
    R_sun: 6.96e8,       // Solar radius (m)
    M_sun: 1.989e30,     // Solar mass (kg)
    R_earth: 6.371e6,    // Earth radius (m)
    M_earth: 5.972e24,   // Earth mass (kg)
    L_sun: 3.828e26,     // Solar luminosity (W)
};

const InteractiveFormulas = () => {
    // State for all formula inputs
    const [inputs, setInputs] = useState({
        // Radial Velocity
        radialVelocity: 10.0,
        restWavelength: 550,
        
        // Transit Method
        planetRadius: 1.1,
        stellarRadius: 1.0,
        
        // Kepler's 3rd Law
        stellarMass: 1.0,
        planetMass: 0.001,
        orbitalPeriod: 365.25,
        orbitalDistance: null,
        
        // Stefan-Boltzmann
        stellarRadiusSB: 1.0,
        stellarTemperature: 5778,
        
        // Feedback Weight
        currentWeight: 1.0,
        prediction: 0.7,
        humanFeedback: true,
        learningRate: 0.1,
        
        // AI Aggregation
        predictions: [0.8, 0.6, 0.9, 0.7],
        weights: [1.2, 0.9, 1.1, 1.0],
        
        // Habitable Zone
        stellarLuminosity: 1.0,
        
        // Equilibrium Temperature
        stellarLuminosityEQ: 1.0,
        orbitalDistanceEQ: 1.0,
        albedo: 0.3,
    });

    // Calculate all formulas reactively
    const calculations = useMemo(() => {
        const results = {};
        
        try {
            // 1. Radial Velocity Doppler Shift: Δλ/λ = vᵣ/c
            const wavelengthShiftRatio = inputs.radialVelocity / CONSTANTS.c;
            const restWavelengthM = inputs.restWavelength * 1e-9;
            const wavelengthShift = wavelengthShiftRatio * restWavelengthM;
            const observedWavelength = restWavelengthM + wavelengthShift;
            
            results.dopplerShift = {
                wavelengthShiftRatio,
                wavelengthShiftNm: wavelengthShift * 1e9,
                observedWavelengthNm: observedWavelength * 1e9,
                formula: 'Δλ/λ = vᵣ/c'
            };
            
            // 2. Transit Method: ΔF/F = (Rₚ/Rₛ)²
            const radiusRatio = (inputs.planetRadius * CONSTANTS.R_earth) / (inputs.stellarRadius * CONSTANTS.R_sun);
            const transitDepth = radiusRatio ** 2;
            const transitDepthPpm = transitDepth * 1e6;
            
            results.transitMethod = {
                radiusRatio,
                transitDepth,
                transitDepthPpm,
                transitDepthPercent: transitDepth * 100,
                formula: 'ΔF/F = (Rₚ/Rₛ)²'
            };
            
            // 3. Kepler's 3rd Law: P² = 4π²a³/G(M* + Mₚ)
            const totalMass = (inputs.stellarMass * CONSTANTS.M_sun) + (inputs.planetMass * CONSTANTS.M_earth);
            const periodSeconds = inputs.orbitalPeriod * 24 * 3600;
            const orbitalDistanceM = ((CONSTANTS.G * totalMass * periodSeconds**2) / (4 * Math.PI**2))**(1/3);
            const orbitalDistanceAU = orbitalDistanceM / CONSTANTS.AU;
            
            results.keplersLaw = {
                orbitalDistanceAU,
                orbitalDistanceM,
                totalMass,
                formula: 'P² = 4π²a³/G(M* + Mₚ)'
            };
            
            // 4. Stefan-Boltzmann Law: L = 4πRₛ²σT⁴
            const stellarRadiusM = inputs.stellarRadiusSB * CONSTANTS.R_sun;
            const luminosityWatts = 4 * Math.PI * stellarRadiusM**2 * CONSTANTS.sigma * inputs.stellarTemperature**4;
            const luminositySolar = luminosityWatts / CONSTANTS.L_sun;
            
            results.stefanBoltzmann = {
                luminosityWatts,
                luminositySolar,
                surfaceArea: 4 * Math.PI * stellarRadiusM**2,
                formula: 'L = 4πRₛ²σT⁴'
            };
            
            // 5. Feedback-Based Knowledge Weight: wᵢ ← wᵢ - η∂L/∂wᵢ
            const h = inputs.humanFeedback ? 1.0 : 0.0;
            const P = Math.max(0.001, Math.min(0.999, inputs.prediction));
            const binaryCrossEntropyLoss = -h * Math.log(P) - (1 - h) * Math.log(1 - P);
            const lossGradient = -h / P + (1 - h) / (1 - P);
            const weightAdjustment = inputs.learningRate * lossGradient * (inputs.humanFeedback ? 0.01 : -0.01);
            const newWeight = Math.max(0.1, Math.min(2.0, inputs.currentWeight - weightAdjustment));
            
            results.feedbackWeight = {
                binaryCrossEntropyLoss,
                lossGradient,
                weightChange: newWeight - inputs.currentWeight,
                newWeight,
                formula: 'L = -h*log(P) - (1-h)*log(1-P)',
                updateFormula: 'wᵢ ← wᵢ - η∂L/∂wᵢ'
            };
            
            // 6. Aggregate Prediction: P = Σ(wᵢ * pᵢ) / Σ(wᵢ)
            const weightedSum = inputs.predictions.reduce((sum, pred, i) => sum + pred * inputs.weights[i], 0);
            const totalWeight = inputs.weights.reduce((sum, w) => sum + w, 0);
            const aggregatedPrediction = weightedSum / totalWeight;
            const predictionVariance = inputs.predictions.reduce((sum, pred) => sum + (pred - aggregatedPrediction)**2, 0) / inputs.predictions.length;
            const confidence = 1.0 - Math.min(1.0, 2 * predictionVariance);
            
            results.aggregatePrediction = {
                aggregatedPrediction,
                predictionVariance,
                confidence,
                totalWeight,
                formula: 'P = Σ(wᵢ * pᵢ) / Σ(wᵢ)'
            };
            
            // 7. Habitable Zone Calculation
            const innerHZ = 0.95 * Math.sqrt(inputs.stellarLuminosity);
            const outerHZ = 1.37 * Math.sqrt(inputs.stellarLuminosity);
            const innerOptimistic = 0.75 * Math.sqrt(inputs.stellarLuminosity);
            const outerOptimistic = 1.77 * Math.sqrt(inputs.stellarLuminosity);
            
            results.habitableZone = {
                innerConservative: innerHZ,
                outerConservative: outerHZ,
                innerOptimistic,
                outerOptimistic,
                width: outerHZ - innerHZ,
                formula: 'HZ = sqrt(L*) * [0.95, 1.37] AU'
            };
            
            // 8. Equilibrium Temperature: T_eq = [(L*/(4πa²)) * (1-A) / (4σ)]^(1/4)
            const luminosityWattsEQ = inputs.stellarLuminosityEQ * CONSTANTS.L_sun;
            const flux = luminosityWattsEQ / (4 * Math.PI * (inputs.orbitalDistanceEQ * CONSTANTS.AU)**2);
            const equilibriumTempK = ((flux * (1 - inputs.albedo)) / (4 * CONSTANTS.sigma))**(1/4);
            const equilibriumTempC = equilibriumTempK - 273.15;
            
            results.equilibriumTemp = {
                temperatureK: equilibriumTempK,
                temperatureC: equilibriumTempC,
                flux,
                formula: 'T_eq = [(L*/(4πa²)) * (1-A) / (4σ)]^(1/4)'
            };
            
        } catch (error) {
            console.error('Calculation error:', error);
        }
        
        return results;
    }, [inputs]);

    const handleInputChange = (field, value) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayInputChange = (field, index, value) => {
        setInputs(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? parseFloat(value) || 0 : item)
        }));
    };

    // Generate visualization data
    const generateTransitCurve = () => {
        const timePoints = [];
        const fluxValues = [];
        const depth = calculations.transitMethod?.transitDepth || 0.01;
        const duration = 4.0; // hours
        
        for (let t = -duration; t <= duration; t += 0.1) {
            timePoints.push(t);
            const inTransit = Math.abs(t) < (duration / 2);
            const flux = inTransit ? 1 - depth : 1;
            const noise = (Math.random() - 0.5) * 0.001;
            fluxValues.push({ time: t, flux: flux + noise });
        }
        
        return fluxValues;
    };

    const generateRadialVelocityCurve = () => {
        const rvData = [];
        const period = inputs.orbitalPeriod;
        const amplitude = 10; // m/s
        
        for (let t = 0; t <= 2 * period; t += period / 50) {
            const phase = 2 * Math.PI * t / period;
            const rv = amplitude * Math.sin(phase);
            const noise = (Math.random() - 0.5) * 2;
            rvData.push({ time: t, velocity: rv + noise });
        }
        
        return rvData;
    };

    const FormulaCard = ({ title, icon: Icon, formula, result, color = "blue", children }) => (
        <Card className={`border-l-4 border-l-${color}-500`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 text-${color}-500`} />
                    {title}
                </CardTitle>
                <div className={`bg-${color}-50 p-2 rounded font-mono text-sm`}>
                    {formula}
                </div>
            </CardHeader>
            <CardContent>
                {children}
                <div className="mt-4 p-3 bg-gray-50 rounded">
                    <h4 className="font-semibold mb-2">Results:</h4>
                    {result}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        🌌 Interactive Exoplanet Discovery Formulas
                    </h1>
                    <p className="text-purple-200 text-lg">
                        Real-time calculations with all core scientific methods
                    </p>
                </div>

                <Tabs defaultValue="doppler" className="w-full">
                    <TabsList className="grid w-full grid-cols-8 mb-6">
                        <TabsTrigger value="doppler">Doppler</TabsTrigger>
                        <TabsTrigger value="transit">Transit</TabsTrigger>
                        <TabsTrigger value="kepler">Kepler</TabsTrigger>
                        <TabsTrigger value="stefan">Stefan</TabsTrigger>
                        <TabsTrigger value="feedback">Feedback</TabsTrigger>
                        <TabsTrigger value="aggregate">Aggregate</TabsTrigger>
                        <TabsTrigger value="habitable">Habitable</TabsTrigger>
                        <TabsTrigger value="temperature">Temperature</TabsTrigger>
                    </TabsList>

                    {/* Radial Velocity Doppler Shift */}
                    <TabsContent value="doppler">
                        <FormulaCard
                            title="Radial Velocity Doppler Shift"
                            icon={Telescope}
                            formula="Δλ/λ = vᵣ/c"
                            color="red"
                            result={
                                calculations.dopplerShift && (
                                    <div className="space-y-2">
                                        <p><strong>Wavelength Shift:</strong> {calculations.dopplerShift.wavelengthShiftNm?.toFixed(4)} nm</p>
                                        <p><strong>Observed Wavelength:</strong> {calculations.dopplerShift.observedWavelengthNm?.toFixed(2)} nm</p>
                                        <p><strong>Shift Ratio:</strong> {(calculations.dopplerShift.wavelengthShiftRatio * 1e6)?.toFixed(2)} ppm</p>
                                    </div>
                                )
                            }
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="radialVelocity">Radial Velocity (m/s)</Label>
                                    <Input
                                        id="radialVelocity"
                                        type="number"
                                        value={inputs.radialVelocity}
                                        onChange={(e) => handleInputChange('radialVelocity', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="restWavelength">Rest Wavelength (nm)</Label>
                                    <Input
                                        id="restWavelength"
                                        type="number"
                                        value={inputs.restWavelength}
                                        onChange={(e) => handleInputChange('restWavelength', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={generateRadialVelocityCurve()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="velocity" stroke="#ef4444" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </FormulaCard>
                    </TabsContent>

                    {/* Transit Method */}
                    <TabsContent value="transit">
                        <FormulaCard
                            title="Transit Method"
                            icon={Globe}
                            formula="ΔF/F = (Rₚ/Rₛ)²"
                            color="green"
                            result={
                                calculations.transitMethod && (
                                    <div className="space-y-2">
                                        <p><strong>Transit Depth:</strong> {calculations.transitMethod.transitDepthPpm?.toFixed(0)} ppm</p>
                                        <p><strong>Radius Ratio:</strong> {calculations.transitMethod.radiusRatio?.toFixed(4)}</p>
                                        <p><strong>Depth (%):</strong> {calculations.transitMethod.transitDepthPercent?.toFixed(3)}%</p>
                                    </div>
                                )
                            }
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="planetRadius">Planet Radius (R⊕)</Label>
                                    <Input
                                        id="planetRadius"
                                        type="number"
                                        value={inputs.planetRadius}
                                        onChange={(e) => handleInputChange('planetRadius', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="stellarRadius">Stellar Radius (R☉)</Label>
                                    <Input
                                        id="stellarRadius"
                                        type="number"
                                        value={inputs.stellarRadius}
                                        onChange={(e) => handleInputChange('stellarRadius', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={generateTransitCurve()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis domain={['dataMin - 0.001', 'dataMax + 0.001']} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="flux" stroke="#10b981" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </FormulaCard>
                    </TabsContent>

                    {/* Kepler's 3rd Law */}
                    <TabsContent value="kepler">
                        <FormulaCard
                            title="Kepler's 3rd Law"
                            icon={Atom}
                            formula="P² = 4π²a³/G(M* + Mₚ)"
                            color="blue"
                            result={
                                calculations.keplersLaw && (
                                    <div className="space-y-2">
                                        <p><strong>Orbital Distance:</strong> {calculations.keplersLaw.orbitalDistanceAU?.toFixed(3)} AU</p>
                                        <p><strong>Total System Mass:</strong> {(calculations.keplersLaw.totalMass / CONSTANTS.M_sun)?.toFixed(3)} M☉</p>
                                        <p><strong>Distance (km):</strong> {(calculations.keplersLaw.orbitalDistanceM / 1000)?.toExponential(2)} km</p>
                                    </div>
                                )
                            }
                        >
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="stellarMass">Stellar Mass (M☉)</Label>
                                    <Input
                                        id="stellarMass"
                                        type="number"
                                        value={inputs.stellarMass}
                                        onChange={(e) => handleInputChange('stellarMass', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="planetMass">Planet Mass (M⊕)</Label>
                                    <Input
                                        id="planetMass"
                                        type="number"
                                        value={inputs.planetMass}
                                        onChange={(e) => handleInputChange('planetMass', parseFloat(e.target.value))}
                                        step="0.001"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="orbitalPeriod">Orbital Period (days)</Label>
                                    <Input
                                        id="orbitalPeriod"
                                        type="number"
                                        value={inputs.orbitalPeriod}
                                        onChange={(e) => handleInputChange('orbitalPeriod', parseFloat(e.target.value))}
                                        step="1"
                                    />
                                </div>
                            </div>
                        </FormulaCard>
                    </TabsContent>

                    {/* Stefan-Boltzmann Law */}
                    <TabsContent value="stefan">
                        <FormulaCard
                            title="Stefan-Boltzmann Law"
                            icon={Zap}
                            formula="L = 4πRₛ²σT⁴"
                            color="yellow"
                            result={
                                calculations.stefanBoltzmann && (
                                    <div className="space-y-2">
                                        <p><strong>Luminosity:</strong> {calculations.stefanBoltzmann.luminositySolar?.toFixed(2)} L☉</p>
                                        <p><strong>Luminosity (Watts):</strong> {calculations.stefanBoltzmann.luminosityWatts?.toExponential(2)} W</p>
                                        <p><strong>Surface Area:</strong> {calculations.stefanBoltzmann.surfaceArea?.toExponential(2)} m²</p>
                                    </div>
                                )
                            }
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="stellarRadiusSB">Stellar Radius (R☉)</Label>
                                    <Input
                                        id="stellarRadiusSB"
                                        type="number"
                                        value={inputs.stellarRadiusSB}
                                        onChange={(e) => handleInputChange('stellarRadiusSB', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="stellarTemperature">Temperature (K)</Label>
                                    <Input
                                        id="stellarTemperature"
                                        type="number"
                                        value={inputs.stellarTemperature}
                                        onChange={(e) => handleInputChange('stellarTemperature', parseFloat(e.target.value))}
                                        step="50"
                                    />
                                </div>
                            </div>
                        </FormulaCard>
                    </TabsContent>

                    {/* Feedback-Based Knowledge Weight */}
                    <TabsContent value="feedback">
                        <FormulaCard
                            title="⚡ Feedback-Based Knowledge Weight"
                            icon={Brain}
                            formula="L = -h*log(P) - (1-h)*log(1-P); wᵢ ← wᵢ - η∂L/∂wᵢ"
                            color="purple"
                            result={
                                calculations.feedbackWeight && (
                                    <div className="space-y-2">
                                        <p><strong>Loss:</strong> {calculations.feedbackWeight.binaryCrossEntropyLoss?.toFixed(4)}</p>
                                        <p><strong>Weight Change:</strong> {calculations.feedbackWeight.weightChange?.toFixed(4)}</p>
                                        <p><strong>New Weight:</strong> {calculations.feedbackWeight.newWeight?.toFixed(4)}</p>
                                        <p><strong>Gradient:</strong> {calculations.feedbackWeight.lossGradient?.toFixed(4)}</p>
                                    </div>
                                )
                            }
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="currentWeight">Current Weight</Label>
                                    <Input
                                        id="currentWeight"
                                        type="number"
                                        value={inputs.currentWeight}
                                        onChange={(e) => handleInputChange('currentWeight', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="prediction">Prediction (0-1)</Label>
                                    <Input
                                        id="prediction"
                                        type="number"
                                        value={inputs.prediction}
                                        onChange={(e) => handleInputChange('prediction', parseFloat(e.target.value))}
                                        step="0.1"
                                        min="0"
                                        max="1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="learningRate">Learning Rate η</Label>
                                    <Input
                                        id="learningRate"
                                        type="number"
                                        value={inputs.learningRate}
                                        onChange={(e) => handleInputChange('learningRate', parseFloat(e.target.value))}
                                        step="0.01"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="humanFeedback"
                                        type="checkbox"
                                        checked={inputs.humanFeedback}
                                        onChange={(e) => handleInputChange('humanFeedback', e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="humanFeedback">Correct Prediction</Label>
                                </div>
                            </div>
                        </FormulaCard>
                    </TabsContent>

                    {/* Aggregate Prediction */}
                    <TabsContent value="aggregate">
                        <FormulaCard
                            title="Aggregate Prediction"
                            icon={Calculator}
                            formula="P = Σ(wᵢ * pᵢ) / Σ(wᵢ)"
                            color="indigo"
                            result={
                                calculations.aggregatePrediction && (
                                    <div className="space-y-2">
                                        <p><strong>Aggregated Prediction:</strong> {calculations.aggregatePrediction.aggregatedPrediction?.toFixed(4)}</p>
                                        <p><strong>Confidence:</strong> {(calculations.aggregatePrediction.confidence * 100)?.toFixed(1)}%</p>
                                        <p><strong>Variance:</strong> {calculations.aggregatePrediction.predictionVariance?.toFixed(4)}</p>
                                        <p><strong>Total Weight:</strong> {calculations.aggregatePrediction.totalWeight?.toFixed(2)}</p>
                                    </div>
                                )
                            }
                        >
                            <div className="space-y-4">
                                <div>
                                    <Label>AI Helper Predictions:</Label>
                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                        {inputs.predictions.map((pred, i) => (
                                            <Input
                                                key={i}
                                                type="number"
                                                value={pred}
                                                onChange={(e) => handleArrayInputChange('predictions', i, e.target.value)}
                                                step="0.1"
                                                min="0"
                                                max="1"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label>Reliability Weights:</Label>
                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                        {inputs.weights.map((weight, i) => (
                                            <Input
                                                key={i}
                                                type="number"
                                                value={weight}
                                                onChange={(e) => handleArrayInputChange('weights', i, e.target.value)}
                                                step="0.1"
                                                min="0.1"
                                                max="2"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={inputs.predictions.map((pred, i) => ({
                                        helper: `AI ${i+1}`,
                                        prediction: pred,
                                        weight: inputs.weights[i]
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="helper" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="prediction" fill="#6366f1" />
                                        <Bar dataKey="weight" fill="#8b5cf6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </FormulaCard>
                    </TabsContent>

                    {/* Habitable Zone */}
                    <TabsContent value="habitable">
                        <FormulaCard
                            title="Habitable Zone Calculation"
                            icon={Globe}
                            formula="HZ = sqrt(L*) * [0.95, 1.37] AU"
                            color="green"
                            result={
                                calculations.habitableZone && (
                                    <div className="space-y-2">
                                        <p><strong>Conservative HZ:</strong> {calculations.habitableZone.innerConservative?.toFixed(2)} - {calculations.habitableZone.outerConservative?.toFixed(2)} AU</p>
                                        <p><strong>Optimistic HZ:</strong> {calculations.habitableZone.innerOptimistic?.toFixed(2)} - {calculations.habitableZone.outerOptimistic?.toFixed(2)} AU</p>
                                        <p><strong>HZ Width:</strong> {calculations.habitableZone.width?.toFixed(2)} AU</p>
                                    </div>
                                )
                            }
                        >
                            <div>
                                <Label htmlFor="stellarLuminosity">Stellar Luminosity (L☉)</Label>
                                <Input
                                    id="stellarLuminosity"
                                    type="number"
                                    value={inputs.stellarLuminosity}
                                    onChange={(e) => handleInputChange('stellarLuminosity', parseFloat(e.target.value))}
                                    step="0.1"
                                />
                            </div>

                            <div className="mt-4 p-4 bg-green-50 rounded">
                                <div className="relative h-8 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded">
                                    <div 
                                        className="absolute h-full bg-green-400 opacity-70 rounded"
                                        style={{
                                            left: `${(calculations.habitableZone?.innerConservative || 0) * 20}%`,
                                            width: `${(calculations.habitableZone?.width || 0) * 20}%`
                                        }}
                                    />
                                </div>
                                <div className="text-xs text-center mt-1 text-green-700">
                                    Conservative Habitable Zone
                                </div>
                            </div>
                        </FormulaCard>
                    </TabsContent>

                    {/* Equilibrium Temperature */}
                    <TabsContent value="temperature">
                        <FormulaCard
                            title="Equilibrium Temperature"
                            icon={Zap}
                            formula="T_eq = [(L*/(4πa²)) * (1-A) / (4σ)]^(1/4)"
                            color="orange"
                            result={
                                calculations.equilibriumTemp && (
                                    <div className="space-y-2">
                                        <p><strong>Temperature:</strong> {calculations.equilibriumTemp.temperatureK?.toFixed(0)} K ({calculations.equilibriumTemp.temperatureC?.toFixed(0)}°C)</p>
                                        <p><strong>Stellar Flux:</strong> {calculations.equilibriumTemp.flux?.toFixed(0)} W/m²</p>
                                        <p><strong>Habitability:</strong> 
                                            <Badge variant={calculations.equilibriumTemp.temperatureC > -20 && calculations.equilibriumTemp.temperatureC < 60 ? "default" : "destructive"}>
                                                {calculations.equilibriumTemp.temperatureC > -20 && calculations.equilibriumTemp.temperatureC < 60 ? "Potentially Habitable" : "Likely Uninhabitable"}
                                            </Badge>
                                        </p>
                                    </div>
                                )
                            }
                        >
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="stellarLuminosityEQ">Stellar Luminosity (L☉)</Label>
                                    <Input
                                        id="stellarLuminosityEQ"
                                        type="number"
                                        value={inputs.stellarLuminosityEQ}
                                        onChange={(e) => handleInputChange('stellarLuminosityEQ', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="orbitalDistanceEQ">Orbital Distance (AU)</Label>
                                    <Input
                                        id="orbitalDistanceEQ"
                                        type="number"
                                        value={inputs.orbitalDistanceEQ}
                                        onChange={(e) => handleInputChange('orbitalDistanceEQ', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="albedo">Albedo (0-1)</Label>
                                    <Input
                                        id="albedo"
                                        type="number"
                                        value={inputs.albedo}
                                        onChange={(e) => handleInputChange('albedo', parseFloat(e.target.value))}
                                        step="0.1"
                                        min="0"
                                        max="1"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 p-4 rounded" style={{
                                background: `linear-gradient(90deg, 
                                    #3b82f6 0%, 
                                    #10b981 ${Math.max(0, Math.min(100, (calculations.equilibriumTemp?.temperatureC + 50) * 2))}%, 
                                    #ef4444 100%)`
                            }}>
                                <div className="text-center text-white font-bold">
                                    Temperature Scale: {calculations.equilibriumTemp?.temperatureC?.toFixed(0)}°C
                                </div>
                            </div>
                        </FormulaCard>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default InteractiveFormulas;