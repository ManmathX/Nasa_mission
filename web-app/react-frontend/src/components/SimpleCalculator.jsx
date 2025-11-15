import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import {  Brain, Search, Globe, Atom, Zap, Thermometer, Rocket, Activity, Wind } from 'lucide-react';
import './SimpleCalculator.css';

const CONSTANTS = {
  G: 6.67430e-11, c: 2.99792458e8, sigma: 5.670374419e-8, AU: 1.495978707e11,
  R_sun: 6.96e8, M_sun: 1.989e30, R_earth: 6.371e6, M_earth: 5.972e24,
  L_sun: 3.828e26, k_B: 1.380649e-23, m_H: 1.6735575e-27,
};

const formulaToTabMap = { 1: 'feedback', 2: 'doppler', 3: 'transit', 4: 'kepler', 5: 'stefan', 6: 'habitable' };

const SimpleCalculator = ({ selectedFormulaId }) => {
  const defaultTab = selectedFormulaId ? formulaToTabMap[selectedFormulaId] : 'feedback';

  const [inputs, setInputs] = useState({
    radialVelocity: 10.0, restWavelength: 550, planetRadius: 1.1, stellarRadius: 1.0,
    stellarMass: 1.0, planetMass: 1.0, orbitalPeriod: 365.25, stellarTemperature: 5778,
    currentWeight: 1.0, prediction: 0.7, humanFeedback: true, learningRate: 0.1,
    atmosphereTemp: 288, molecularMass: 29, stellarLuminosity: 1.0,
  });

  const handleInputChange = (key, value) => setInputs(prev => ({ ...prev, [key]: value }));


  const calculations = useMemo(() => {
    const results = {};
    try {
      // Radial Velocity
      const vrOverC = inputs.radialVelocity / CONSTANTS.c;
      const shiftInMeters = vrOverC * (inputs.restWavelength * 1e-9);
      results.dopplerShift = { wavelengthShiftNm: shiftInMeters * 1e9, shiftRatioPpm: vrOverC * 1e6 };

      // Transit Method
      const rr = (inputs.planetRadius * CONSTANTS.R_earth) / (inputs.stellarRadius * CONSTANTS.R_sun);
      results.transitMethod = { transitDepthPpm: (rr ** 2) * 1e6, radiusRatio: rr };

      // Kepler’s 3rd Law
      const totalMass = (inputs.stellarMass * CONSTANTS.M_sun) + (inputs.planetMass * CONSTANTS.M_earth);
      const a_cubed = CONSTANTS.G * totalMass * (inputs.orbitalPeriod * 86400) ** 2 / (4 * Math.PI ** 2);
      results.keplersLaw = { orbitalDistanceAU: (a_cubed ** (1 / 3)) / CONSTANTS.AU, totalMass };

      // Stefan-Boltzmann Law
      const sr = inputs.stellarRadius * CONSTANTS.R_sun;
      const lum = 4 * Math.PI * sr ** 2 * CONSTANTS.sigma * inputs.stellarTemperature ** 4;
      results.stefanBoltzmann = { luminositySolar: lum / CONSTANTS.L_sun, luminosityWatts: lum };

      // AI Model Feedback Formula
      const h = inputs.humanFeedback ? 1.0 : 0.0;
      const p = Math.max(0.001, Math.min(0.999, inputs.prediction));
      const loss = -h * Math.log(p) - (1 - h) * Math.log(1 - p);
      const grad = -h / p + (1 - h) / (1 - p);
      const newWeight = Math.max(0.1, Math.min(2.0, inputs.currentWeight - inputs.learningRate * grad));
      results.feedbackWeight = { loss, weightChange: newWeight - inputs.currentWeight, newWeight };

      // Habitable Zone
      const lumStar = inputs.stellarLuminosity * CONSTANTS.L_sun;
      const inner = Math.sqrt(lumStar / (1.1 * CONSTANTS.L_sun)) * 0.95;
      const outer = Math.sqrt(lumStar / (0.53 * CONSTANTS.L_sun)) * 1.37;
      const inHZ = results.keplersLaw?.orbitalDistanceAU >= inner && results.keplersLaw?.orbitalDistanceAU <= outer;
      results.habitableZone = { inner, outer, inHZ, width: outer - inner };

      // Escape Velocity
      const pr = inputs.planetRadius * CONSTANTS.R_earth;
      const pm = inputs.planetMass * CONSTANTS.M_earth;
      const escVel = Math.sqrt((2 * CONSTANTS.G * pm) / pr);
      results.escapeVelocity = { kmPerS: escVel / 1000, mach: escVel / 343 };

      // Surface Gravity
      const grav = (CONSTANTS.G * pm) / pr ** 2;
      results.surfaceGravity = { gMS: grav, relativeGEarth: grav / 9.81 };

      // Atmospheric Scale Height
      const molMass = inputs.molecularMass * CONSTANTS.m_H;
      const scaleHeight = (CONSTANTS.k_B * inputs.atmosphereTemp) / (molMass * grav);
      results.atmosphere = { scaleHeightKm: scaleHeight / 1000, pressure10km: Math.exp(-10000 / scaleHeight) };
    } catch (e) { console.error(e); }
    return results;
  }, [inputs]);

  const FormulaCard = ({ title, icon: Icon, formula, children, resultsBlock }) => (
    <Card className="bg-black/20 backdrop-blur-sm border border-blue-500/30 shadow-xl mt-6">
      <CardHeader className="border-b border-gray-600/30 p-4 flex items-center space-x-3">
        <Icon className="text-blue-300" size={22} />
        <CardTitle className="text-blue tracking-wide font-mono">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div>
          <h4 className="text-blue-300 text-sm font-mono mb-2">FORMULA:</h4>
          <div className="bg-black/30 p-3 rounded border border-gray-700 text-blue font-mono">{formula}</div>
        </div>
        <div>
          <h4 className="text-blue-300 text-sm font-mono mb-2">INPUTS:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/30 p-4 rounded border border-gray-700">{children}</div>
        </div>
        <div>
          <h4 className="text-green-300 text-sm font-mono mb-2">RESULTS:</h4>
          <div className="bg-black/30 p-4 rounded border border-green-500/20 text-blue font-mono text-sm">{resultsBlock}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen py-10 px-6 bg-gradient-to-b from-gray-1200 via-black to-gray-1200 flex justify-center items-center">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue mb-2">Exoplanet Research Station</h1>
          <p className="text-blue-300 mb-6">Advanced Computational Analysis Suite</p>

        </header>
<Tabs defaultValue={defaultTab}>
  <TabsList
    className="flex flex-wrap justify-center gap-4 p-5 mb-10 bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-blue-400/30 rounded-xl shadow-lg backdrop-blur-md"
  >
    {[
      { value: "feedback", label: "⚡ AI-ML" },
      { value: "doppler", label: "📡 RV" },
      { value: "transit", label: "🌍 Transit" },
      { value: "kepler", label: "⚛️ Orbit" },
      { value: "stefan", label: "⭐ Stellar" },
      { value: "habitable", label: "🌊 HZ" },
      { value: "escape", label: "🚀 Escape" },
      { value: "gravity", label: "⚖️ Gravity" },
      { value: "atmosphere", label: "💨 Atmosphere" },
    ].map(({ value, label }) => (
      <TabsTrigger
        key={value}
        value={value}
        className="text-lg py-3 px-7 font-bold whitespace-nowrap rounded-lg 
                   bg-gradient-to-r from-blue-700 to-blue-500 text-blue shadow-md
                   hover:scale-105 hover:shadow-blue-500/50 hover:from-blue-600 hover:to-blue-400
                   data-[state=active]:ring-4 data-[state=active]:ring-blue-300 
                   data-[state=active]:from-blue-600 data-[state=active]:to-blue-500
                   transition-all duration-200 ease-out"
      >
        {label}
      </TabsTrigger>
    ))}
  </TabsList>




          <TabsContent value="feedback">
            <FormulaCard
              title="Novel AI Feedback Weight Formula"
              icon={Brain}
              formula="w₍ᵢ₎ ← w₍ᵢ₎ - η∂L/∂w₍ᵢ₎ where L = -h log P - (1-h) log(1-P)"
              resultsBlock={
                calculations.feedbackWeight ? (
                  <div>
                    <p>Loss: {calculations.feedbackWeight.loss.toFixed(4)}</p>
                    <p>Δw: {calculations.feedbackWeight.weightChange.toFixed(4)}</p>
                    <p>New Weight: {calculations.feedbackWeight.newWeight.toFixed(3)}</p>
                  </div>
                ) : 'Invalid input'
              }
            >
              <label>
                Weight (wᵢ):
                <input type="number" className="input"
                  value={inputs.currentWeight}
                  onChange={e => handleInputChange('currentWeight', parseFloat(e.target.value))}
                />
              </label>
              <label>
                Prediction (P):
                <input type="number" className="input"
                  value={inputs.prediction}
                  onChange={e => handleInputChange('prediction', parseFloat(e.target.value))}
                />
              </label>
              <label>
                Learning Rate (η):
                <input type="number" className="input"
                  value={inputs.learningRate}
                  onChange={e => handleInputChange('learningRate', parseFloat(e.target.value))}
                />
              </label>
              <label>
                Human Feedback (h):
                <input type="checkbox"
                  checked={inputs.humanFeedback}
                  onChange={e => handleInputChange('humanFeedback', e.target.checked)}
                />
              </label>
            </FormulaCard>
          </TabsContent>

          {/* Radial Velocity */}
          <TabsContent value="doppler">
            <FormulaCard
              title="Radial Velocity (Doppler Shift)"
              icon={Search}
              formula="Δλ/λ = vᵣ/c"
              resultsBlock={
                calculations.dopplerShift ? (
                  <div>
                    <p>λ Shift: {calculations.dopplerShift.wavelengthShiftNm.toFixed(4)} nm</p>
                    <p>Shift Ratio: {calculations.dopplerShift.shiftRatioPpm.toFixed(2)} ppm</p>
                  </div>
                ) : 'Invalid input'
              }
            >
              <label>
                Radial Velocity (m/s):
                <input type="number" className="input"
                  value={inputs.radialVelocity}
                  onChange={e => handleInputChange('radialVelocity', parseFloat(e.target.value))}
                />
              </label>
              <label>
                Rest Wavelength (nm):
                <input type="number" className="input"
                  value={inputs.restWavelength}
                  onChange={e => handleInputChange('restWavelength', parseFloat(e.target.value))}
                />
              </label>
            </FormulaCard>
          </TabsContent>

          {/* Transit Method */}
          <TabsContent value="transit">
            <FormulaCard
              title="Transit Method"
              icon={Globe}
              formula="ΔF/F = (Rₚ/Rₛ)²"
              resultsBlock={
                calculations.transitMethod ? (
                  <div>
                    <p>Transit Depth: {calculations.transitMethod.transitDepthPpm.toFixed(0)} ppm</p>
                    <p>Radius Ratio: {calculations.transitMethod.radiusRatio.toFixed(4)}</p>
                  </div>
                ) : 'Invalid input'
              }
            >
              <label>
                Planet Radius (R⊕):
                <input type="number" className="input"
                  value={inputs.planetRadius}
                  onChange={e => handleInputChange('planetRadius', parseFloat(e.target.value))}
                  step="0.1"
                />
              </label>
              <label>
                Stellar Radius (R☉):
                <input type="number" className="input"
                  value={inputs.stellarRadius}
                  onChange={e => handleInputChange('stellarRadius', parseFloat(e.target.value))}
                  step="0.1"
                />
              </label>
            </FormulaCard>
          </TabsContent>

          {/* Kepler's 3rd Law */}
          <TabsContent value="kepler">
            <FormulaCard
              title="Kepler's 3rd Law"
              icon={Atom}
              formula="P² = 4π²a³/G(M* + Mₚ)"
              resultsBlock={
                calculations.keplersLaw ? (
                  <div>
                    <p>Orbital Distance: {calculations.keplersLaw.orbitalDistanceAU.toFixed(3)} AU</p>
                    <p>Total Mass: {(calculations.keplersLaw.totalMass / CONSTANTS.M_sun).toFixed(3)} M☉</p>
                  </div>
                ) : 'Invalid input'
              }
            >
              <label>
                Stellar Mass (M☉):
                <input type="number" className="input"
                  value={inputs.stellarMass}
                  onChange={e => handleInputChange('stellarMass', parseFloat(e.target.value))}
                  step="0.1"
                />
              </label>
              <label>
                Planet Mass (M⊕):
                <input type="number" className="input"
                  value={inputs.planetMass}
                  onChange={e => handleInputChange('planetMass', parseFloat(e.target.value))}
                  step="0.001"
                />
              </label>
              <label>
                Orbital Period (days):
                <input type="number" className="input"
                  value={inputs.orbitalPeriod}
                  onChange={e => handleInputChange('orbitalPeriod', parseFloat(e.target.value))}
                  step="1"
                />
              </label>
            </FormulaCard>
          </TabsContent>

          {/* Stefan-Boltzmann Law */}
          <TabsContent value="stefan">
            <FormulaCard
              title="Stefan-Boltzmann Law"
              icon={Zap}
              formula="L = 4πRₛ²σT⁴"
              resultsBlock={
                calculations.stefanBoltzmann ? (
                  <div>
                    <p>Luminosity: {calculations.stefanBoltzmann.luminositySolar.toFixed(2)} L☉</p>
                    <p>Luminosity (Watts): {calculations.stefanBoltzmann.luminosityWatts.toExponential(2)} W</p>
                  </div>
                ) : 'Invalid input'
              }
            >
              <label>
                Stellar Radius (R☉):
                <input type="number" className="input"
                  value={inputs.stellarRadius}
                  onChange={e => handleInputChange('stellarRadius', parseFloat(e.target.value))}
                  step="0.1"
                />
              </label>
              <label>
                Temperature (K):
                <input type="number" className="input"
                  value={inputs.stellarTemperature}
                  onChange={e => handleInputChange('stellarTemperature', parseFloat(e.target.value))}
                  step="50"
                />
              </label>
            </FormulaCard>
          </TabsContent>

          {/* Habitable Zone */}
          <TabsContent value="habitable">
            <FormulaCard
              title="Habitable Zone Calculator"
              icon={Thermometer}
              formula="r_inner = √(L/1.1L☉) × 0.95 AU, r_outer = √(L/0.53L☉) × 1.37 AU"
              resultsBlock={
                calculations.habitableZone ? (
                  <div>
                    <p>Inner HZ: {calculations.habitableZone.inner.toFixed(3)} AU</p>
                    <p>Outer HZ: {calculations.habitableZone.outer.toFixed(3)} AU</p>
                    <p>HZ Width: {calculations.habitableZone.width.toFixed(3)} AU</p>
                    <p className={calculations.habitableZone.inHZ ? 'text-green-400' : 'text-red-400'}>
                      Status: {calculations.habitableZone.inHZ ? '✓ IN HABITABLE ZONE' : '✗ OUTSIDE HZ'}
                    </p>
                  </div>
                ) : 'Invalid input'
              }
            >
              <label>
                Stellar Luminosity (L☉):
                <input type="number" className="input"
                  value={inputs.stellarLuminosity}
                  onChange={e => handleInputChange('stellarLuminosity', parseFloat(e.target.value))}
                  step="0.1"
                />
              </label>
              <label>
                Orbital Period (days):
                <input type="number" className="input"
                  value={inputs.orbitalPeriod}
                  onChange={e => handleInputChange('orbitalPeriod', parseFloat(e.target.value))}
                  step="1"
                />
              </label>
            </FormulaCard>
          </TabsContent>

          {/* Escape Velocity */}
          <TabsContent value="escape">
            <FormulaCard
              title="Escape Velocity"
              icon={Rocket}
              formula="v_esc = √(2GM/R)"
              resultsBlock={
                calculations.escapeVelocity ? (
                  <div>
                    <p>Escape Velocity: {calculations.escapeVelocity.kmPerS.toFixed(2)} km/s</p>
                    <p>Relative to Sound: Mach {calculations.escapeVelocity.mach.toFixed(1)}</p>
                    <p className={calculations.escapeVelocity.kmPerS > 11.2 ? 'text-orange-400' : 'text-green-400'}>
                      {calculations.escapeVelocity.kmPerS > 11.2 ? 
                        '⚠️ Higher than Earth (11.2 km/s)' : 
                        '✓ Lower than Earth'}
                    </p>
                  </div>
                ) : 'Invalid input'
              }
            >
              <label>
                Planet Mass (M⊕):
                <input type="number" className="input"
                  value={inputs.planetMass}
                  onChange={e => handleInputChange('planetMass', parseFloat(e.target.value))}
                  step="0.1"
                />
              </label>
              <label>
                Planet Radius (R⊕):
                <input type="number" className="input"
                  value={inputs.planetRadius}
                  onChange={e => handleInputChange('planetRadius', parseFloat(e.target.value))}
                  step="0.1"
                />
              </label>
            </FormulaCard>
          </TabsContent>

          {/* Surface Gravity */}
          <TabsContent value="gravity">
            <FormulaCard
              title="Surface Gravity"
              icon={Activity}
              formula="g = GM/R²"
              resultsBlock={
                calculations.surfaceGravity ? (
                  <div>
                    <p>Surface Gravity: {calculations.surfaceGravity.gMS.toFixed(2)} m/s²</p>
                    <p>Relative to Earth: {calculations.surfaceGravity.relativeGEarth.toFixed(2)} g</p>
                    <p className={
                      calculations.surfaceGravity.relativeGEarth > 1.5 ? 'text-orange-400' :
                      calculations.surfaceGravity.relativeGEarth < 0.5 ? 'text-orange-400' :
                      'text-green-400'
                    }>
                      {calculations.surfaceGravity.relativeGEarth > 1.5 ? 
                        '⚠️ High gravity' :
                        calculations.surfaceGravity.relativeGEarth < 0.5 ?
                        '⚠️ Low gravity' :
                        '✓ Earth-like gravity'}
                    </p>
                  </div>
                ) : 'Invalid input'
              }
            >
              <label>
                Planet Mass (M⊕):
                <input type="number" className="input"
                  value={inputs.planetMass}
                  onChange={e => handleInputChange('planetMass', parseFloat(e.target.value))}
                  step="0.1"
                />
              </label>
              <label>
                Planet Radius (R⊕):
                <input type="number" className="input"
                  value={inputs.planetRadius}
                  onChange={e => handleInputChange('planetRadius', parseFloat(e.target.value))}
                  step="0.1"
                />
              </label>
            </FormulaCard>
          </TabsContent>

          {/* Atmospheric Scale Height */}
          <TabsContent value="atmosphere">
            <FormulaCard
              title="Atmospheric Scale Height"
              icon={Wind}
              formula="H = k_B T / (m g)"
              resultsBlock={
                calculations.atmosphere ? (
                  <div>
                    <p>Scale Height: {calculations.atmosphere.scaleHeightKm.toFixed(2)} km</p>
                    <p>Pressure at 10km: {(calculations.atmosphere.pressure10km * 100).toFixed(1)}% of surface</p>
                    <p className="text-blue-400">
                      {calculations.atmosphere.scaleHeightKm > 8.5 ? 
                        'More extended than Earth (8.5 km)' : 
                        'More compact than Earth'}
                    </p>
                  </div>
                ) : 'Invalid input'
              }
            >
              <label>
                Temperature (K):
                <input type="number" className="input"
                  value={inputs.atmosphereTemp}
                  onChange={e => handleInputChange('atmosphereTemp', parseFloat(e.target.value))}
                  step="10"
                />
              </label>
              <label>
                Molecular Mass (amu):
                <input type="number" className="input"
                  value={inputs.molecularMass}
                  onChange={e => handleInputChange('molecularMass', parseFloat(e.target.value))}
                  step="1"
                />
                <small className="text-teal-400 text-xs">N₂: 28, O₂: 32, CO₂: 44, H₂: 2</small>
              </label>
              <label>
                Planet Mass (M⊕):
                <input type="number" className="input"
                  value={inputs.planetMass}
                  onChange={e => handleInputChange('planetMass', parseFloat(e.target.value))}
                  step="0.1"
                />
              </label>
            </FormulaCard>
          </TabsContent>

        </Tabs>
    </div>
    </div>
  );
};

SimpleCalculator.propTypes = {
  selectedFormulaId: PropTypes.number,
};

export default SimpleCalculator;
