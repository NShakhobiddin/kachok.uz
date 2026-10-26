# muscles-v2.glb — attribution and license

This file is an adapted version of the **Z-Anatomy** 3D atlas
(https://www.z-anatomy.com, https://github.com/Z-Anatomy/Models-of-human-anatomy),
by Gauthier Kervyn (design, 3D, anatomy), Marcin Zielinski and Lluis Vinent,
licensed under **CC BY-SA 4.0** (https://creativecommons.org/licenses/by-sa/4.0/).

Z-Anatomy is derived from **BodyParts3D**, © The Database Center for Life Science (DBCLS),
Kousaku Okubo. Mitsuhashi N, et al. BodyParts3D: 3D structure database for anatomical concepts.
Nucleic Acids Res 37:D782–D785, 2009. https://doi.org/10.1093/nar/gkn613

Changes made for Kachok: muscle meshes grouped into 37 named muscle groups plus "other",
"tendon" and "bones"; dense meshes decimated and sparse muscle meshes smoothed with one Loop
subdivision step (~770k triangles in total); the external-oblique aponeurosis covering rectus
abdominis removed; units normalised to metres (Y-up); a per-vertex attribute _FIBAO added
(principal fibre direction of each muscle part and baked ambient occlusion); quantized and
compressed with EXT_meshopt_compression.

This adapted model is distributed under the same license, **CC BY-SA 4.0**.
The rest of the Kachok application code is a separate work and is not covered by this license.
